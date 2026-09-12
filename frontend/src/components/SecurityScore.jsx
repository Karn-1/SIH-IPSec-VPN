const SecurityScore = ({ score, status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Secure':
        return 'text-soc-success';
      case 'Warning':
        return 'text-soc-warning';
      case 'Critical':
        return 'text-soc-danger';
      default:
        return 'text-soc-textSecondary';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'Secure':
        return 'bg-soc-success/20 border-soc-success/30';
      case 'Warning':
        return 'bg-soc-warning/20 border-soc-warning/30';
      case 'Critical':
        return 'bg-soc-danger/20 border-soc-danger/30';
      default:
        return 'bg-soc-textSecondary/20 border-soc-textSecondary/30';
    }
  };

  const getCircleColor = (score) => {
    if (score >= 70) return '#10B981';
    if (score >= 40) return '#F59E0B';
    return '#EF4444';
  };

  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="rounded-xl border border-soc-border bg-soc-card p-6">
      <div className="mb-2"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-soc-textMuted">Risk assessment</p><h3 className="mt-1 text-lg font-semibold text-soc-text">Security score</h3></div>
      <div className="flex items-center justify-center">
        <div className="relative">
          <svg width="160" height="160" className="transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="#202832"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke={getCircleColor(score)}
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-soc-text">{score}</span>
            <span className="text-sm text-soc-textSecondary">/ 100</span>
          </div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusBg(status)} ${getStatusColor(status)}`}>
          {status.toUpperCase()}
        </span>
      </div>
    </div>
  );
};

export default SecurityScore;
