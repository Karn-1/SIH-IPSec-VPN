const PredictionCard = ({ icon: Icon, title, value, confidence, color }) => {
  const getColorClasses = (color) => {
    switch (color) {
      case 'blue':
        return 'bg-soc-textMuted/20 text-soc-textSecondary border-soc-borderLight';
      case 'green':
        return 'bg-soc-success/20 text-soc-success border-soc-success/30';
      case 'purple':
        return 'bg-soc-primary/20 text-soc-primaryLight border-soc-primary/30';
      default:
        return 'bg-soc-primary/20 text-soc-primary border-soc-primary/30';
    }
  };

  return (
    <div className="rounded-xl border border-soc-border bg-soc-card p-6 transition-colors hover:border-soc-borderLight">
      <div className="mb-5 flex items-center justify-between">
        <div className={`rounded-lg border p-3 ${getColorClasses(color)}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="text-right">
          <p className="text-right text-2xl font-bold text-soc-text">{value}</p>
        </div>
      </div>
      <p className="mb-2 text-sm text-soc-textSecondary">{title}</p>
      <div className="h-2 w-full rounded-full bg-soc-background">
        <div className="h-2 rounded-full bg-soc-primary transition-all duration-500" style={{ width: `${confidence}%` }} />
      </div>
      <p className="mt-2 text-xs text-soc-textMuted">Model confidence: {confidence}%</p>
    </div>
  );
};

export default PredictionCard;
