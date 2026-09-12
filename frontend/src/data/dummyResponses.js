const basePredictions = {
  mode: { label: 'Tunnel', confidence: 0.96 },
  traffic_type: { label: 'Web', confidence: 0.91 },
};

const response = ({
  id,
  filename,
  createdAt,
  score,
  status,
  cipher,
  cipherConfidence,
  configuration,
  findings,
  recommendations,
}) => ({
  analysis: {
    id,
    filename,
    status: 'completed',
    created_at: createdAt,
  },
  ai_predictions: {
    ...basePredictions,
    cipher: { label: cipher, confidence: cipherConfidence },
  },
  traffic_features: {
    packet_count: score >= 90 ? 8421 : score >= 60 ? 12140 : 4218,
    len_mean: score >= 90 ? 731.2 : score >= 60 ? 982.5 : 411.7,
    len_std: score >= 90 ? 112.4 : score >= 60 ? 245.8 : 98.3,
    iat_mean: score >= 90 ? 0.038 : score >= 60 ? 0.021 : 0.074,
    entropy_mean: score >= 90 ? 7.94 : score >= 60 ? 6.71 : 5.82,
  },
  security_configuration: {
    available: true,
    source: 'dummy_response',
    ...configuration,
  },
  security_assessment: {
    score,
    status,
    findings,
    recommendations,
  },
  notices: [],
});

export const dummyResponses = {
  secure: response({
    id: 'ANL-DEMO-001',
    filename: 'office_vpn_secure.pcap',
    createdAt: '2026-09-11T14:20:00Z',
    score: 95,
    status: 'Secure',
    cipher: 'AES-GCM',
    cipherConfidence: 0.94,
    configuration: {
      pfs_enabled: true,
      replay_protection: true,
      dh_group: 'MODP-3072',
      key_size_bits: 256,
      sha1_used: false,
      key_lifetime: 28800,
      cipher: 'aes-gcm',
    },
    findings: [
      {
        severity: 'info',
        title: 'Strong encryption detected',
        description: 'AES-GCM encryption was detected.',
      },
      {
        severity: 'info',
        title: 'Perfect Forward Secrecy enabled',
        description: 'PFS is enabled in the detected configuration.',
      },
    ],
    recommendations: [
      {
        priority: 'low',
        title: 'No critical remediation required',
        description: 'The detected configuration meets the current security checks.',
      },
    ],
  }),
  warning: response({
    id: 'ANL-DEMO-002',
    filename: 'branch_vpn_warning.pcap',
    createdAt: '2026-09-11T15:30:00Z',
    score: 61,
    status: 'Warning',
    cipher: 'AES-CBC',
    cipherConfidence: 0.92,
    configuration: {
      pfs_enabled: false,
      replay_protection: true,
      dh_group: 'MODP-2048',
      key_size_bits: 128,
      sha1_used: false,
      key_lifetime: 28800,
      cipher: 'aes-cbc',
    },
    findings: [
      {
        severity: 'warning',
        title: 'AES-CBC encryption detected',
        description: 'AES-CBC encryption was detected instead of authenticated encryption.',
      },
      {
        severity: 'warning',
        title: 'Perfect Forward Secrecy disabled',
        description: 'PFS is not enabled in the detected configuration.',
      },
    ],
    recommendations: [
      {
        priority: 'medium',
        title: 'Migrate to AES-GCM',
        description: 'Use authenticated encryption for improved security.',
      },
      {
        priority: 'medium',
        title: 'Enable PFS',
        description: 'Enable Perfect Forward Secrecy for improved key-compromise protection.',
      },
    ],
  }),
  critical: response({
    id: 'ANL-DEMO-003',
    filename: 'legacy_gateway_critical.pcap',
    createdAt: '2026-09-11T16:45:00Z',
    score: 30,
    status: 'Critical',
    cipher: 'AES-CBC',
    cipherConfidence: 0.89,
    configuration: {
      pfs_enabled: true,
      replay_protection: true,
      dh_group: 'MODP-1024',
      key_size_bits: 128,
      sha1_used: true,
      key_lifetime: 3600,
      cipher: 'aes-cbc',
    },
    findings: [
      {
        severity: 'warning',
        title: 'AES-CBC encryption detected',
        description: 'Legacy AES-CBC encryption was found in the SA configuration.',
      },
      {
        severity: 'critical',
        title: 'Weak DH group',
        description: 'MODP-1024 provides insufficient security.',
      },
      {
        severity: 'warning',
        title: 'SHA-1 detected',
        description: 'SHA-1 is present in the security configuration.',
      },
    ],
    recommendations: [
      {
        priority: 'high',
        title: 'Migrate AES-CBC to AES-GCM',
        description: 'Use authenticated encryption for improved security.',
      },
      {
        priority: 'high',
        title: 'Use a stronger DH group',
        description: 'Move to MODP-2048 or stronger.',
      },
      {
        priority: 'high',
        title: 'Remove SHA-1',
        description: 'Replace SHA-1 with SHA-256 or stronger.',
      },
    ],
  }),
};
