const FeaturePanel = ({ features }) => {
  if (!features) return null;

  const meanLength = features.len_mean ?? features.packet_len_mean;
  const featureCards = [
    { label: 'Packets', value: features.packet_count?.toLocaleString() || 'N/A', icon: '01' },
    { label: 'Avg Length', value: `${meanLength?.toFixed(1) || 'N/A'} B`, icon: '02' },
    { label: 'Avg IAT', value: `${(features.iat_mean * 1000)?.toFixed(1) || 'N/A'} ms`, icon: '03' },
    { label: 'Entropy', value: features.entropy_mean?.toFixed(2) || 'N/A', icon: '04' },
  ];

  return (
    <div className="rounded-xl border border-soc-border bg-soc-card p-6">
      <div className="mb-5"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-soc-textMuted">Packet telemetry</p><h3 className="mt-1 text-lg font-semibold text-soc-text">Traffic characteristics</h3></div>
      <div className="grid grid-cols-2 gap-4">
        {featureCards.map((card, index) => (
          <div key={index} className="rounded-lg border border-soc-border bg-soc-background p-4">
            <div className="mb-3 font-mono text-xs text-soc-accent">{card.icon}</div>
            <p className="text-2xl font-bold text-soc-text">{card.value}</p>
            <p className="mt-1 text-xs text-soc-textSecondary">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturePanel;
