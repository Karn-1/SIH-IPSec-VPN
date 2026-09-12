const SecurityConfig = ({ config }) => {
  const safeConfig = config || {};
  if (safeConfig.available === false) {
    return (
      <div className="rounded-xl border border-soc-warning/30 bg-soc-card p-6">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-soc-textMuted">Control plane</p>
          <h3 className="mt-1 text-lg font-semibold text-soc-text">Security configuration</h3>
        </div>
        <div className="rounded-lg border border-soc-warning/20 bg-soc-warning/5 p-4">
          <p className="font-semibold text-soc-warning">StrongSwan SA log was not uploaded</p>
          <p className="mt-2 text-sm leading-6 text-soc-textSecondary">Security configuration details are unavailable for this analysis.</p>
        </div>
      </div>
    );
  }
  const booleanValue = (value) => value === null || value === undefined ? 'Unverified' : value ? 'Enabled' : 'Disabled';
  const configItems = [
    { label: 'PFS', value: booleanValue(safeConfig.pfs_enabled), status: safeConfig.pfs_enabled === null || safeConfig.pfs_enabled === undefined ? 'info' : safeConfig.pfs_enabled ? 'success' : 'warning' },
    { label: 'Replay Protection', value: booleanValue(safeConfig.replay_protection), status: safeConfig.replay_protection === null || safeConfig.replay_protection === undefined ? 'info' : safeConfig.replay_protection ? 'success' : 'warning' },
    { label: 'DH Group', value: safeConfig.dh_group || 'Unverified', status: 'info' },
    { label: 'AES Key Size', value: safeConfig.key_size_bits ? `${safeConfig.key_size_bits}-bit` : 'Unverified', status: 'info' },
    { label: 'SHA-1', value: safeConfig.sha1_used === null || safeConfig.sha1_used === undefined ? 'Unverified' : safeConfig.sha1_used ? 'Detected' : 'Not Detected', status: safeConfig.sha1_used === null || safeConfig.sha1_used === undefined ? 'info' : safeConfig.sha1_used ? 'danger' : 'success' },
    { label: 'Key Lifetime', value: safeConfig.key_lifetime ? `${safeConfig.key_lifetime >= 3600 ? safeConfig.key_lifetime / 3600 : safeConfig.key_lifetime}${safeConfig.key_lifetime >= 3600 ? ' hours' : 's'}` : 'Unverified', status: 'info' },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '●';
      case 'warning': return '⚠';
      case 'danger': return '!';
      default: return '○';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-soc-success';
      case 'warning': return 'text-soc-warning';
      case 'danger': return 'text-soc-danger';
      default: return 'text-soc-textSecondary';
    }
  };

  return (
    <div className="rounded-xl border border-soc-border bg-soc-card p-6">
      <div className="mb-5"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-soc-textMuted">Control plane</p><h3 className="mt-1 text-lg font-semibold text-soc-text">Security configuration</h3></div>
      <div className="space-y-3">
        {configItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between border-b border-soc-border py-2.5 last:border-0">
            <span className="text-soc-textSecondary">{item.label}</span>
            <div className="flex items-center space-x-2">
              <span className={getStatusColor(item.status)}>{getStatusIcon(item.status)}</span>
              <span className="text-soc-text font-medium">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityConfig;
