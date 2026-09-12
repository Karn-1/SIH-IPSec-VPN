import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const TechnicalDetails = ({ analysis, features }) => {
  const [open, setOpen] = useState(false);
  const metadata = analysis?.analysis || analysis || {};
  const meanLength = features?.len_mean ?? features?.packet_len_mean;
  const formatDate = metadata.created_at ? new Date(metadata.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';

  return (
    <section className="rounded-xl border border-soc-border bg-soc-card">
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between p-6 text-left">
        <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-soc-textMuted">For investigators</p><h2 className="mt-1 text-lg font-semibold text-soc-text">Technical details</h2></div>
        <ChevronDown className={`h-5 w-5 text-soc-textSecondary transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="grid gap-6 border-t border-soc-border p-6 text-sm sm:grid-cols-3">
          <div><p className="mb-3 font-semibold text-soc-text">Feature extraction</p><dl className="space-y-2 text-soc-textSecondary"><div className="flex justify-between gap-3"><dt>Packet count</dt><dd className="font-mono text-soc-text">{features?.packet_count?.toLocaleString() || 'N/A'}</dd></div><div className="flex justify-between gap-3"><dt>Mean length</dt><dd className="font-mono text-soc-text">{meanLength ?? 'N/A'}</dd></div><div className="flex justify-between gap-3"><dt>Mean IAT</dt><dd className="font-mono text-soc-text">{features?.iat_mean ?? 'N/A'}</dd></div><div className="flex justify-between gap-3"><dt>Entropy</dt><dd className="font-mono text-soc-text">{features?.entropy_mean ?? 'N/A'}</dd></div></dl></div>
          <div><p className="mb-3 font-semibold text-soc-text">Analysis metadata</p><dl className="space-y-2 text-soc-textSecondary"><div className="flex justify-between gap-3"><dt>Analysis ID</dt><dd className="font-mono text-soc-text">{metadata.id || 'N/A'}</dd></div><div className="flex justify-between gap-3"><dt>Capture</dt><dd className="max-w-[12rem] truncate font-mono text-soc-text">{metadata.filename || 'N/A'}</dd></div><div className="flex justify-between gap-3"><dt>Status</dt><dd className="text-soc-success">{metadata.status || 'N/A'}</dd></div><div className="flex justify-between gap-3"><dt>Created</dt><dd className="text-soc-text">{formatDate}</dd></div></dl></div>
          <div><p className="mb-3 font-semibold text-soc-text">Model information</p><dl className="space-y-2 text-soc-textSecondary"><div className="flex justify-between gap-3"><dt>Mode classifier</dt><dd className="text-soc-text">Random Forest</dd></div><div className="flex justify-between gap-3"><dt>Traffic classifier</dt><dd className="text-soc-text">Random Forest</dd></div><div className="flex justify-between gap-3"><dt>Cipher classifier</dt><dd className="text-soc-text">XGBoost</dd></div></dl></div>
        </div>
      )}
    </section>
  );
};

export default TechnicalDetails;
