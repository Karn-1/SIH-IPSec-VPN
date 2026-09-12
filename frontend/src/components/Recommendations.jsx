import { ArrowUpRight, Lightbulb } from 'lucide-react';

const Recommendations = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="rounded-xl border border-soc-border bg-soc-card p-6">
        <h3 className="text-lg font-semibold text-soc-text mb-4">Recommended actions</h3>
        <p className="text-sm text-soc-textSecondary">No recommendations available</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-soc-border bg-soc-card p-6">
      <div className="mb-5 flex items-center justify-between">
        <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-soc-textMuted">Remediation queue</p><h3 className="mt-1 text-lg font-semibold text-soc-text">Recommended actions</h3></div>
        <Lightbulb className="h-5 w-5 text-soc-warning" />
      </div>

      <div className="space-y-3">
        {recommendations.map((recommendation, index) => (
          <div
            key={index}
            className="flex items-start gap-3 rounded-lg border border-soc-accent/20 bg-soc-accent/5 p-4"
          >
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-soc-accent/15 text-xs font-bold text-soc-accent">{index + 1}</span>
            <div className="min-w-0 flex-1"><p className="font-semibold text-soc-text">{recommendation.title || recommendation}</p>{recommendation.description && <p className="mt-1 text-sm leading-5 text-soc-textSecondary">{recommendation.description}</p>}</div>
            <ArrowUpRight className="mt-1 h-4 w-4 flex-shrink-0 text-soc-textMuted" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
