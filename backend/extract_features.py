import math
from collections import Counter

from scapy.all import ESP, IP, IPv6, Raw, UDP, rdpcap


def calculate_entropy(data: bytes) -> float:
    """Calculate Shannon entropy for a byte sequence."""
    if not data:
        return 0.0

    counts = Counter(data)
    length = len(data)
    return -sum(
        (count / length) * math.log2(count / length)
        for count in counts.values()
    )


def _mean(values: list[float]) -> float:
    return sum(values) / len(values) if values else 0.0


def _std(values: list[float]) -> float:
    if len(values) < 2:
        return 0.0

    average = _mean(values)
    return math.sqrt(
        sum((value - average) ** 2 for value in values) / len(values)
    )


def extract_features(pcap_path: str) -> dict[str, float | int]:
    """Read an IP packet capture and return aggregate ML-ready features."""
    packets = rdpcap(pcap_path)
    packet_lengths: list[float] = []
    payload_lengths: list[float] = []
    inter_arrival_times: list[float] = []
    entropy_values: list[float] = []
    packet_times: list[float] = []
    esp_detected = False
    nat_t_detected = False
    ipv4_count = 0
    ipv6_count = 0
    previous_time: float | None = None

    for packet in packets:
        if IP not in packet and IPv6 not in packet:
            continue
        ipv4_count += int(IP in packet)
        ipv6_count += int(IPv6 in packet)
        esp_detected = esp_detected or (IP in packet and packet[IP].proto == 50)
        nat_t_detected = nat_t_detected or (
            UDP in packet and 4500 in (packet[UDP].sport, packet[UDP].dport)
        )

        packet_lengths.append(float(len(packet)))
        if Raw in packet:
            payload = bytes(packet[Raw].load)
        elif ESP in packet:
            esp_payload = packet[ESP].payload
            payload = bytes(esp_payload) if esp_payload else bytes(packet[ESP].data or b"")
        else:
            payload = b""
        payload_lengths.append(float(len(payload)))
        entropy_values.append(calculate_entropy(payload))

        current_time = float(packet.time)
        packet_times.append(current_time)
        if previous_time is not None:
            inter_arrival_times.append(max(0.0, current_time - previous_time))
        previous_time = current_time

    if len(packet_lengths) < 2:
        raise ValueError("PCAP contains fewer than 2 usable IP packets.")

    return {
        "packet_count": len(packet_lengths),
        "len_mean": _mean(packet_lengths),
        "len_std": _std(packet_lengths),
        "payload_len_mean": _mean(payload_lengths),
        "payload_len_std": _std(payload_lengths),
        "iat_mean": _mean(inter_arrival_times),
        "iat_std": _std(inter_arrival_times),
        "entropy_mean": _mean(entropy_values),
        "entropy_std": _std(entropy_values),
        "packet_rate": len(packet_lengths) / max(packet_times[-1] - packet_times[0], 1e-9),
        "esp_detected": esp_detected,
        "nat_t_detected": nat_t_detected,
        "ipv4_count": ipv4_count,
        "ipv6_count": ipv6_count,
        "_packet_lengths": packet_lengths,
        "_iat_sequence": inter_arrival_times,
    }
