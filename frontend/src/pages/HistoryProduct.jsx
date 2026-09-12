import { Calendar, Eye, Filter, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dummyResponses } from '../data/dummyResponses';

const toHistoryItem = (response) => ({
  ...response.analysis,
  mode: response.ai_predictions?.mode?.label || 'Unknown',
  cipher: response.ai_predictions?.cipher?.label || 'Unknown',
  score: response.security_assessment?.score ?? 0,
  status: response.security_assessment?.status || 'Unknown',
  date: new Date(response.analysis.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  response,
});

const HistoryProduct = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [analyses] = useState(() => {
    const storedResults = JSON.parse(localStorage.getItem('analysisHistory') || '[]');
    const allResponses = [...storedResults, ...Object.values(dummyResponses)];
    const uniqueResponses = allResponses.filter((response, index, items) => (
      items.findIndex((item) => item.analysis?.id === response.analysis?.id) === index
    ));
    return uniqueResponses.map(toHistoryItem);
  });
  const filtered = useMemo(() => analyses.filter((analysis) => {
    const matchesSearch = analysis.filename.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || analysis.status.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  }), [analyses, filter, search]);

  const inspect = (analysis) => {
    localStorage.setItem('analysisResult', JSON.stringify(analysis.response));
    localStorage.setItem('analysisFilename', analysis.filename);
    navigate(`/result/${analysis.id}`);
  };

  return (
    <div className="p-5 sm:p-8"><div className="mb-8"><p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-soc-primary">Analysis archive</p><h1 className="text-3xl font-bold text-soc-text sm:text-4xl">History</h1><p className="mt-2 text-soc-textSecondary">Search previous captures and reopen their complete security evidence.</p></div><div className="mb-6 flex flex-col gap-3 rounded-xl border border-soc-border bg-soc-card p-4 sm:flex-row"><label className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-soc-textMuted" /><span className="sr-only">Search captures</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search captures" className="w-full rounded-lg border border-soc-border bg-soc-background py-2.5 pl-10 pr-3 text-sm text-soc-text placeholder:text-soc-textMuted focus:border-soc-accent focus:outline-none" /></label><label className="flex items-center gap-2"><Filter className="h-4 w-4 text-soc-textMuted" /><span className="sr-only">Filter status</span><select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-lg border border-soc-border bg-soc-background px-3 py-2.5 text-sm text-soc-text focus:border-soc-accent focus:outline-none"><option value="all">All statuses</option><option value="secure">Secure</option><option value="warning">Warning</option><option value="critical">Critical</option></select></label></div><div className="overflow-x-auto rounded-xl border border-soc-border bg-soc-card"><table className="w-full min-w-[720px] text-left"><thead className="border-b border-soc-border text-xs uppercase tracking-wider text-soc-textMuted"><tr><th className="px-5 py-4 font-medium">Capture</th><th className="px-5 py-4 font-medium">Mode</th><th className="px-5 py-4 font-medium">Cipher</th><th className="px-5 py-4 font-medium">Score</th><th className="px-5 py-4 font-medium">Status</th><th className="px-5 py-4 font-medium">Action</th></tr></thead><tbody>{filtered.map((analysis) => <tr key={analysis.id} className="border-b border-soc-border/70 hover:bg-soc-cardHover"><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-soc-accent/10 p-2 text-soc-accent"><Calendar className="h-4 w-4" /></div><div><p className="font-semibold text-soc-text">{analysis.filename}</p><p className="mt-1 text-xs text-soc-textMuted">{analysis.date}</p></div></div></td><td className="px-5 py-4 text-sm text-soc-textSecondary">{analysis.mode}</td><td className="px-5 py-4 font-mono text-sm text-soc-textSecondary">{analysis.cipher}</td><td className={`px-5 py-4 font-semibold ${analysis.score >= 70 ? 'text-soc-success' : analysis.score >= 40 ? 'text-soc-warning' : 'text-soc-danger'}`}>{analysis.score}</td><td className="px-5 py-4 text-sm text-soc-textSecondary">{analysis.status}</td><td className="px-5 py-4"><button type="button" onClick={() => inspect(analysis)} aria-label={`Inspect ${analysis.filename}`} className="rounded-md p-2 text-soc-textSecondary hover:bg-soc-background hover:text-soc-accent"><Eye className="h-4 w-4" /></button></td></tr>)}</tbody></table>{filtered.length === 0 && <p className="p-8 text-center text-sm text-soc-textSecondary">No analyses match your filters.</p>}</div></div>
  );
};

export default HistoryProduct;
