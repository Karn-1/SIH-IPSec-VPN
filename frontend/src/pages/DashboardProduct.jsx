import { Activity, AlertTriangle, ArrowUpRight, CheckCircle2, FileSearch, LockKeyhole, ShieldAlert, Sparkles, Upload } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { dummyResponses } from '../data/dummyResponses';

const demoAnalyses = Object.values(dummyResponses).map((response) => ({
  ...response.analysis,
  mode: response.ai_predictions.mode.label,
  cipher: response.ai_predictions.cipher.label,
  score: response.security_assessment.score,
  date: new Date(response.analysis.created_at).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }),
}));

const statusForScore = (score) => (score >= 70 ? 'Secure' : score >= 40 ? 'Warning' : 'Critical');

const activityData = [
  { day: 'Mon', analyses: 8, score: 74 },
  { day: 'Tue', analyses: 12, score: 78 },
  { day: 'Wed', analyses: 9, score: 71 },
  { day: 'Thu', analyses: 16, score: 84 },
  { day: 'Fri', analyses: 13, score: 87 },
  { day: 'Sat', analyses: 18, score: 91 },
  { day: 'Sun', analyses: 15, score: 89 },
];

const cipherData = [
  { name: 'AES-GCM', value: 48, color: '#10B981' },
  { name: 'AES-CBC', value: 28, color: '#34D399' },
  { name: '3DES', value: 14, color: '#A7B4AA' },
  { name: 'Other', value: 10, color: '#3A4A40' },
];

const DashboardProduct = () => {
  const navigate = useNavigate();
  const counts = {
    secure: demoAnalyses.filter((analysis) => analysis.score >= 70).length,
    warning: demoAnalyses.filter((analysis) => analysis.score >= 40 && analysis.score < 70).length,
    critical: demoAnalyses.filter((analysis) => analysis.score < 40).length,
  };

  const openDemo = (analysis) => {
    const response = Object.values(dummyResponses).find((item) => item.analysis.id === analysis.id);
    localStorage.setItem('analysisResult', JSON.stringify(response));
    localStorage.setItem('analysisFilename', analysis.filename);
    navigate(`/result/${analysis.id}`);
  };

  const statCards = [
    { label: 'Total analyses', value: demoAnalyses.length, icon: Activity, tone: 'text-soc-primaryLight' },
    { label: 'Secure', value: counts.secure, icon: CheckCircle2, tone: 'text-soc-success' },
    { label: 'Warnings', value: counts.warning, icon: AlertTriangle, tone: 'text-soc-warning' },
    { label: 'Critical', value: counts.critical, icon: ShieldAlert, tone: 'text-soc-danger' },
  ];

  return (
    <div className="space-y-8 p-5 pt-8 sm:p-8 sm:pt-10">
      <section className="relative overflow-hidden rounded-3xl border border-soc-border bg-gradient-to-br from-soc-card via-soc-card to-[#234633] p-6 shadow-xl shadow-[#102019]/20 sm:p-10">
        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-soc-primary/10 blur-3xl" />
        <div className="relative max-w-3xl">
          <div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-soc-primary"><Sparkles className="h-4 w-4" /> Encrypted traffic, made clear</div>
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-soc-text sm:text-5xl">See the signal inside every IPsec capture.</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-soc-textSecondary sm:text-lg">IPsec AI turns complex packet evidence into a clear security story. Detect weak controls, understand risk, and move confidently from discovery to remediation.</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link to="/new-analysis" className="inline-flex items-center justify-center gap-2 rounded-lg bg-soc-primary px-5 py-3 text-sm font-bold text-soc-background transition hover:bg-soc-primaryLight">
              <Upload className="h-4 w-4" /> Start an analysis
            </Link>
            <Link to="/reports" className="inline-flex items-center justify-center gap-2 rounded-lg border border-soc-borderLight bg-soc-background/60 px-5 py-3 text-sm font-bold text-soc-text transition hover:border-soc-primary/60 hover:text-soc-primaryLight">Explore reports <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { step: '01', title: 'Upload a capture', text: 'Send a PCAP and optional SA log securely to the analysis workflow.' },
          { step: '02', title: 'Let AI investigate', text: 'The backend classifies IPsec traffic and evaluates the security posture.' },
          { step: '03', title: 'Act with confidence', text: 'Review evidence, findings, and recommendations in one clear report.' },
        ].map((item) => (
          <div key={item.step} className="group rounded-xl border border-soc-border bg-soc-card/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-soc-primary/40 hover:bg-soc-card">
            <span className="font-mono text-xs font-bold tracking-[0.2em] text-soc-primary">{item.step}</span>
            <h3 className="mt-4 font-semibold text-soc-text">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-soc-textSecondary">{item.text}</p>
          </div>
        ))}
      </section>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-soc-primary">Live overview</p>
          <h1 className="text-2xl font-bold tracking-tight text-soc-text sm:text-3xl">Your security posture at a glance</h1>
          <p className="mt-2 max-w-2xl text-soc-textSecondary">A focused view of encrypted traffic, risk signals, and the controls that need attention.</p>
        </div>
        <Link to="/new-analysis" className="inline-flex items-center justify-center gap-2 rounded-lg border border-soc-primary/40 bg-soc-primary/10 px-4 py-2.5 text-sm font-bold text-soc-primaryLight transition hover:bg-soc-primary/20">
          <Upload className="h-4 w-4" />
          New analysis
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-xl border border-soc-border bg-soc-card p-5">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm text-soc-textSecondary">{label}</span>
              <Icon className={`h-5 w-5 ${tone}`} />
            </div>
            <p className="text-3xl font-bold text-soc-text">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <section className="rounded-xl border border-soc-border bg-soc-card p-5 sm:p-6">
          <div className="mb-5 flex items-start justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-soc-textMuted">Seven-day trend</p><h2 className="mt-1 text-lg font-semibold text-soc-text">Analysis activity</h2></div><div className="rounded-lg bg-soc-primary/10 p-2 text-soc-primary"><Activity className="h-5 w-5" /></div></div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs><linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22C55E" stopOpacity={0.3} /><stop offset="100%" stopColor="#22C55E" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid stroke="#2C4739" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: '#C5D5CA', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#C5D5CA', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#17251F', border: '1px solid #40604D', borderRadius: 12, color: '#F7FBF8', boxShadow: '0 10px 30px rgba(16,32,25,0.28)' }} />
                <Area type="monotone" dataKey="analyses" stroke="#22C55E" strokeWidth={3} fill="url(#activityFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="rounded-xl border border-soc-border bg-soc-card p-5 sm:p-6">
          <div className="mb-2"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-soc-textMuted">Cipher distribution</p><h2 className="mt-1 text-lg font-semibold text-soc-text">Encryption mix</h2></div>
          <div className="flex h-52 items-center gap-4">
            <ResponsiveContainer width="52%" height="100%"><PieChart><Pie data={cipherData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={76} paddingAngle={3}>{cipherData.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip contentStyle={{ background: '#0E131A', border: '1px solid #2A3440', borderRadius: 8 }} /></PieChart></ResponsiveContainer>
            <div className="space-y-3">{cipherData.map((item) => <div key={item.name} className="flex items-center gap-2 text-xs text-soc-textSecondary"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} /> <span>{item.name}</span><span className="font-semibold text-soc-text">{item.value}%</span></div>)}</div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-soc-primary/20 bg-soc-primary/5 p-3 text-xs text-soc-textSecondary"><LockKeyhole className="h-4 w-4 shrink-0 text-soc-primary" /> Modern authenticated encryption is leading your fleet.</div>
        </section>
      </div>

      <section className="rounded-xl border border-soc-border bg-soc-card p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-soc-textMuted">Posture by day</p><h2 className="mt-1 text-lg font-semibold text-soc-text">Average security score</h2></div><span className="text-sm text-soc-primary">+12.4% this week</span></div>
        <div className="h-52 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={activityData} barSize={28}><CartesianGrid stroke="#202832" vertical={false} /><XAxis dataKey="day" tick={{ fill: '#8993A4', fontSize: 12 }} axisLine={false} tickLine={false} /><YAxis domain={[0, 100]} tick={{ fill: '#8993A4', fontSize: 12 }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ background: '#0E131A', border: '1px solid #2A3440', borderRadius: 8 }} /><Bar dataKey="score" fill="#34D399" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div>
      </section>

      <div className="content-grid">
        <section className="rounded-xl border border-soc-border bg-soc-card">
          <div className="flex items-center justify-between border-b border-soc-border px-5 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-soc-textMuted">Recent evidence</p>
              <h2 className="mt-1 text-lg font-semibold text-soc-text">Analysis history</h2>
            </div>
            <Link to="/history" className="inline-flex items-center gap-1 text-sm font-semibold text-soc-accent hover:text-soc-accentLight">View all <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead className="text-xs uppercase tracking-wider text-soc-textMuted">
                <tr className="border-b border-soc-border"><th className="px-5 py-3 font-medium">Capture</th><th className="px-5 py-3 font-medium">Mode</th><th className="px-5 py-3 font-medium">Cipher</th><th className="px-5 py-3 font-medium">Score</th><th className="px-5 py-3 font-medium">Action</th></tr>
              </thead>
              <tbody>
                {demoAnalyses.map((analysis) => (
                  <tr key={analysis.id} className="border-b border-soc-border/70 transition hover:bg-soc-cardHover">
                    <td className="px-5 py-4"><p className="font-semibold text-soc-text">{analysis.filename}</p><p className="mt-1 text-xs text-soc-textMuted">{analysis.date}</p></td>
                    <td className="px-5 py-4 text-sm text-soc-textSecondary">{analysis.mode}</td>
                    <td className="px-5 py-4 font-mono text-sm text-soc-textSecondary">{analysis.cipher}</td>
                    <td className="px-5 py-4"><span className={analysis.score >= 70 ? 'text-soc-success' : analysis.score >= 40 ? 'text-soc-warning' : 'text-soc-danger'}>{analysis.score}</span><span className="ml-2 text-xs text-soc-textMuted">{statusForScore(analysis.score)}</span></td>
                    <td className="px-5 py-4"><button type="button" onClick={() => openDemo(analysis)} className="text-sm font-semibold text-soc-accent hover:text-soc-accentLight">Inspect</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="rounded-xl border border-soc-border bg-soc-card p-5">
          <div className="mb-6 flex items-center gap-3"><div className="rounded-lg bg-soc-accent/10 p-2 text-soc-accent"><FileSearch className="h-5 w-5" /></div><div><p className="text-xs uppercase tracking-wider text-soc-textMuted">Demo workspace</p><h2 className="font-semibold text-soc-text">Three response ratings</h2></div></div>
          <p className="text-sm leading-6 text-soc-textSecondary">Every row is backed by the same structured response contract used by the API. Inspect each state to verify the UI behaves consistently across risk levels.</p>
          <div className="mt-6 space-y-3">
            {['Secure posture', 'Warning posture', 'Critical posture'].map((label, index) => <div key={label} className="flex items-center justify-between rounded-lg border border-soc-border bg-soc-background px-3 py-2.5 text-sm"><span className="text-soc-textSecondary">{label}</span><span className={index === 0 ? 'text-soc-success' : index === 1 ? 'text-soc-warning' : 'text-soc-danger'}>{index === 0 ? counts.secure : index === 1 ? counts.warning : counts.critical}</span></div>)}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DashboardProduct;
