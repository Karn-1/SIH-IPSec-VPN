import re


def _search(pattern: str, text: str) -> str | None:
    match = re.search(pattern, text, flags=re.IGNORECASE | re.MULTILINE)
    return match.group(1) if match else None


def _parse_bool(text: str, positive: list[str], negative: list[str]) -> bool | None:
    if any(re.search(pattern, text, re.IGNORECASE) for pattern in negative):
        return False
    if any(re.search(pattern, text, re.IGNORECASE) for pattern in positive):
        return True
    return None


def parse_sa_log(path: str) -> dict:
    """
    Parse StrongSwan CHILD_SA / ESP values from an SA log.
    Handles:
    - Strong SA log (AES-GCM-256, MODP-3072, PFS=yes)
    - Weak SA log   (AES-CBC-128, MODP-1024, SHA-1)
    - Missing / empty SA log
    """
    with open(path, encoding="utf-8", errors="replace") as source:
        text = source.read()

    if not text.strip():
        return unavailable_security_configuration()

    # Capture the full CHILD_SA block
    child_section_match = re.search(
        r"(?is)(?:CHILD_SA|child-sa).*?(?=IKE_SA|\Z)",
        text,
    )
    child_sa = child_section_match.group(0) if child_section_match else text

    # ---------- Cipher + Key Size (FIXED) ----------
    # This pattern now also captures formats like AES_GCM_16-256
    cipher_pattern = (
        r"\b("
        r"aes(?:[-_ ]?(?:128|192|256))?[-_ ]?(?:gcm|cbc)(?:[-_ ]?\d+)?(?:[-_ ]?\d+)?"
        r"|aes[-_ ]?(?:gcm|cbc)[-_ ]?(?:128|192|256)"
        r"|3des|des"
        r")\b"
    )

    cipher_match = re.search(cipher_pattern, child_sa, re.IGNORECASE)
    if not cipher_match:
        cipher_match = re.search(cipher_pattern, text, re.IGNORECASE)

    cipher = None
    key_size = None

    if cipher_match:
        raw_cipher = cipher_match.group(0)
        cipher_lower = raw_cipher.lower()

        if "aes" in cipher_lower:
            mode_match = re.search(r"(gcm|cbc)", cipher_lower)
            cipher = f"aes-{mode_match.group(1)}" if mode_match else "aes"

            # Multiple strategies to extract key size
            key_size_match = re.search(
                r"(?:aes[-_ ]?)?(?:gcm|cbc)?[-_ ]?(128|192|256)"
                r"|(?:gcm|cbc)[-_ ]?\d+[-_ ](128|192|256)"
                r"|[-_](128|192|256)\b",
                cipher_lower,
            )
            if key_size_match:
                key_size = int(next(g for g in key_size_match.groups() if g))
        else:
            cipher = cipher_lower
            key_size = 192 if cipher == "3des" else None

    # ---------- DH Group ----------
    dh_group = _search(r"\b(modp[-_ ]?\d+|ecp[-_ ]?\d+)\b", child_sa)
    if not dh_group:
        dh_group = _search(r"\b(modp[-_ ]?\d+|ecp[-_ ]?\d+)\b", text)

    if dh_group:
        dh_group = re.sub(r"[-_ ]+", "-", dh_group.upper())
        dh_group = re.sub(r"^(MODP|ECP)(\d+)$", r"\1-\2", dh_group)

    # ---------- Key Lifetime ----------
    lifetime = _search(
        r"(?:key\s*)?(?:lifetime|rekeytime)\s*[=:]?\s*(\d+)\s*(?:s|seconds)?",
        text,
    )

    # ---------- PFS ----------
    pfs_enabled = _parse_bool(
        child_sa,
        [
            r"\bpfs(?:[-_ ]|\s)*[:=]?\s*(?:yes|true|enabled|on)\b",
            r"\bwith[-_ ]pfs\b",
            r"\bpfs[-_ ]enabled\b",
        ],
        [
            r"\bpfs(?:[-_ ]|\s)*[:=]?\s*(?:no|false|disabled|off)\b",
            r"\bwithout[-_ ]pfs\b",
            r"\bpfs[-_ ]disabled\b",
        ],
    )
    if pfs_enabled is None:
        pfs_enabled = _parse_bool(
            text,
            [
                r"\bpfs(?:[-_ ]|\s)*[:=]?\s*(?:yes|true|enabled|on)\b",
                r"\bwith[-_ ]pfs\b",
                r"\bpfs[-_ ]enabled\b",
            ],
            [
                r"\bpfs(?:[-_ ]|\s)*[:=]?\s*(?:no|false|disabled|off)\b",
                r"\bwithout[-_ ]pfs\b",
                r"\bpfs[-_ ]disabled\b",
            ],
        )

    # ---------- Replay Protection ----------
    replay_protection = _parse_bool(
        text,
        [
            r"\breplay(?:[-_ ]|_)*protection\s*[:=]?\s*(?:enabled|yes|true|on)\b",
            r"\breplay-window\s*[:=]?\s*[1-9]\d*",
        ],
        [
            r"\breplay(?:[-_ ]|_)*protection\s*[:=]?\s*(?:disabled|no|false|off)\b",
            r"\breplay-window\s*[:=]?\s*0\b",
        ],
    )

    # ---------- SHA-1 ----------
    sha1_pattern = r"\b(?:sha[-_ ]?1|hmac[-_ ]*sha[-_ ]*1)(?:[-_ ]*\d+)?\b"
    sha1_match = re.search(sha1_pattern, child_sa, re.IGNORECASE)
    if not sha1_match:
        sha1_match = re.search(sha1_pattern, text, re.IGNORECASE)

    # ---------- Mode ----------
    mode_match = re.search(r"\bmode\s*[:=]\s*(tunnel|transport)\b", child_sa, re.IGNORECASE)
    mode = mode_match.group(1) if mode_match else None
    if not mode:
        mode_match = re.search(r"\b(tunnel|transport)\s+mode\b", child_sa, re.IGNORECASE)
        mode = mode_match.group(1) if mode_match else None
    if not mode:
        mode_match = re.search(r"\bmode\s*[:=]\s*(tunnel|transport)\b", text, re.IGNORECASE)
        mode = mode_match.group(1) if mode_match else None

    if not any(
        (
            cipher,
            dh_group,
            lifetime,
            pfs_enabled is not None,
            replay_protection is not None,
            sha1_match,
            mode,
        )
    ):
        return unavailable_security_configuration()

    sha1_used = (
        bool(sha1_match)
        if sha1_match
        else (False if cipher == "aes-gcm" else None)
    )

    return {
        "available": True,
        "source": "strongswan_sa_log",
        "pfs_enabled": pfs_enabled,
        "replay_protection": replay_protection,
        "dh_group": dh_group,
        "key_size_bits": key_size,
        "sha1_used": sha1_used,
        "key_lifetime": int(lifetime) if lifetime else None,
        "cipher": cipher,
        "mode": mode.title() if mode else None,
    }


def unavailable_security_configuration() -> dict:
    return {
        "available": False,
        "source": None,
        "pfs_enabled": None,
        "replay_protection": None,
        "dh_group": None,
        "key_size_bits": None,
        "sha1_used": None,
        "key_lifetime": None,
        "cipher": None,
        "mode": None,
    }