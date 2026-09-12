import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';

const Findings = ({ findings }) => {
  if (!findings || findings.length === 0) {
    return (
      <div className="rounded-xl border border-soc-border bg-soc-card p-6">
        <h3 className="text-lg font-semibold text-soc-text mb-4">Security findings</h3>
        <p className="text-sm text-soc-textSecondary">No findings available</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-soc-border bg-soc-card p-6">
      <div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-soc-textMuted">Assessment evidence</p><h3 className="mt-1 text-lg font-semibold text-soc-text">Security findings</h3></div><span className="rounded-full bg-soc-background px-3 py-1 text-xs text-soc-textSecondary">{findings.length} findings</span></div>
      
      <div className="space-y-3">
        {findings.map((finding, index) => {
          const severity = finding.severity || finding.type || 'info';
          const isWarning = severity === 'warning';
          const Icon = severity === 'critical' || severity === 'error' ? XCircle : isWarning ? AlertTriangle : severity === 'info' ? Info : CheckCircle2;
          const tone = severity === 'critical' || severity === 'error' ? 'danger' : isWarning ? 'warning' : 'success';

          return (
            <div
              key={index}
              className={`flex items-start gap-3 rounded-lg border p-4 ${tone === 'success' ? 'border-soc-success/20 bg-soc-success/5' : tone === 'warning' ? 'border-soc-warning/20 bg-soc-warning/5' : 'border-soc-danger/20 bg-soc-danger/5'}`}
            >
              <Icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${tone === 'success' ? 'text-soc-success' : tone === 'warning' ? 'text-soc-warning' : 'text-soc-danger'}`} />
              <div className="min-w-0"><p className="font-semibold text-soc-text">{finding.title || finding.message}</p>{finding.description && <p className="mt-1 text-sm leading-5 text-soc-textSecondary">{finding.description}</p>}{finding.recommendation && <p className="mt-2 text-xs text-soc-textMuted">Action: {finding.recommendation}</p>}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Findings;
