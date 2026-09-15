def assess_security(configuration: dict, traffic_features: dict | None = None) -> dict:
    """Score the configuration and packet evidence in a way that reflects real-world SA visibility.

    Missing SA logs and signal-free captures should no longer occupy the same 100/secure
    baseline as a fully parsed StrongSwan configuration.
    """
    score = 100
    findings = []
    recommendations = []

    if not configuration.get("available"):
        score -= 35
        findings.append({"severity": "warning", "title": "StrongSwan SA log not provided", "description": "No SA log was supplied, so the configuration could not be fully verified."})
        recommendations.append({"priority": "high", "title": "Upload a StrongSwan SA log", "description": "Attach the SA log to reveal cipher, DH group, PFS, replay, and mode checks."})

    cipher = (configuration.get("cipher") or "").lower()
    if cipher in {"3des", "des"}:
        score -= 50
        findings.append({"severity": "critical", "title": "Weak encryption detected", "description": "Legacy DES/3DES encryption was found in the SA configuration."})
        recommendations.append({"priority": "high", "title": "Migrate to modern authenticated encryption", "description": "Replace DES/3DES with AES-GCM."})
    elif "aes-cbc" in cipher:
        score -= 40
        findings.append({"severity": "warning", "title": "AES-CBC detected", "description": "Legacy AES-CBC encryption was found in the SA configuration."})
        recommendations.append({"priority": "high", "title": "Migrate AES-CBC to AES-GCM", "description": "Use authenticated encryption for improved security."})

    dh_group = (configuration.get("dh_group") or "").lower()
    if dh_group == "modp-1024":
        score -= 20
        findings.append({"severity": "critical", "title": "Weak DH group", "description": "MODP-1024 provides insufficient security."})
        recommendations.append({"priority": "high", "title": "Use a stronger DH group", "description": "Move to MODP-2048 or stronger."})
    if configuration.get("pfs_enabled") is False:
        score -= 15
        findings.append({"severity": "warning", "title": "PFS disabled", "description": "Perfect Forward Secrecy is not enabled."})
    if configuration.get("replay_protection") is False:
        score -= 15
        findings.append({"severity": "warning", "title": "Replay protection disabled", "description": "Replay protection is not active."})
    if configuration.get("key_size_bits") is not None and configuration["key_size_bits"] < 128:
        score -= 10
        findings.append({"severity": "warning", "title": "Weak key size", "description": "The configured key size is below 128 bits."})
    if configuration.get("sha1_used") is True:
        score -= 10
        findings.append({"severity": "warning", "title": "SHA-1 detected", "description": "SHA-1 is present in the security configuration."})

    if traffic_features:
        if traffic_features.get("esp_detected") is False and traffic_features.get("nat_t_detected") is False:
            score -= 10
            findings.append({"severity": "warning", "title": "No ESP/NAT-T evidence", "description": "The capture did not show a clear ESP or NAT-T tunnel signature."})
        if traffic_features.get("packet_count", 0) < 20:
            score -= 5
            findings.append({"severity": "info", "title": "Sparse packet evidence", "description": "Too few packets were observed to make a high-confidence security assessment."})

    if configuration.get("available") and not findings:
        findings.append({"severity": "info", "title": "No known critical issues detected", "description": "No configured weakness was detected from the available evidence."})
        recommendations.append({"priority": "low", "title": "No critical remediation required", "description": "The detected configuration meets the current security checks."})

    score = max(0, min(100, score))
    status = "Secure" if score >= 90 else "Warning" if score >= 60 else "Critical"
    return {"score": score, "status": status, "findings": findings, "recommendations": recommendations}
