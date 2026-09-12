import { useEffect, useState } from 'react';
import { ArrowLeft, Download, FileText, LockKeyhole, ShieldCheck, TrafficCone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FeaturePanel from '../components/FeaturePanel';
import Findings from '../components/Findings';
import PredictionCard from '../components/PredictionCard';
import Recommendations from '../components/Recommendations';
import SecurityConfig from '../components/SecurityConfig';
import SecurityScore from '../components/SecurityScore';
import ConfidenceChart from '../components/ConfidenceChart';
import TrafficChart from '../components/TrafficChart';
import TechnicalDetails from '../components/TechnicalDetails';

const readAnalysis = () => {
  const stored = localStorage.getItem('analysisResult');
  if (!stored) return null;
  const parsed = JSON.parse(stored);
  return parsed.analysis && !parsed.ai_predictions ? parsed : parsed;
};

const predictionValue = (prediction) => (typeof prediction === 'object' && prediction !== null ? prediction.label : prediction) || 'Unknown';

const predictionConfidence = (prediction, fallback) => {
  const value = typeof prediction === 'object' && prediction !== null ? prediction.confidence : fallback;
  if (typeof value !== 'number') return 0;
  return Math.round(value <= 1 ? value * 100 : value);
};

const AnalysisResultProduct = () => {
  const navigate = useNavigate();
  const [analysis] = useState(readAnalysis);

  useEffect(() => {
    if (!analysis) navigate('/');
  }, [analysis, navigate]);

  if (!analysis) return <div className="p-8 text-soc-textSecondary">Loading analysis...</div>;

  const predictions = analysis.ai_predictions || {};
  const features = analysis.traffic_features || {};
  const config = analysis.security_configuration || {};
  const assessment = analysis.security_assessment || {};
  const metadata = analysis.analysis || analysis;
  const filename = metadata.filename || localStorage.getItem('analysisFilename') || 'Unknown capture';
  const findings = assessment.findings || [];
  const recommendations = assessment.recommendations || [];
  const status = assessment.status || 'Unknown';

  return (
    <div className="p-5 sm:p-8">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <button type="button" onClick={() => navigate('/')} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-soc-textSecondary transition hover:text-soc-text"><ArrowLeft className="h-4 w-4" />Back to dashboard</button>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-soc-primary">Analysis complete</p>
          <h1 className="text-3xl font-bold tracking-tight text-soc-text sm:text-4xl">Security assessment</h1>
          <p className="mt-2 font-mono text-sm text-soc-textSecondary">{filename} <span className="mx-2 text-soc-textMuted">/</span> {metadata.id || 'Live result'}</p>
        </div>
        <button type="button" onClick={() => navigate('/reports')} className="inline-flex items-center justify-center gap-2 rounded-lg border border-soc-border bg-soc-card px-4 py-2.5 text-sm font-semibold text-soc-text transition hover:border-soc-accent"><Download className="h-4 w-4" />Open report</button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <PredictionCard icon={ShieldCheck} title="IPsec mode" value={predictionValue(predictions.mode)} confidence={predictionConfidence(predictions.mode, predictions.mode_confidence)} color="blue" />
        <PredictionCard icon={TrafficCone} title="Traffic profile" value={predictionValue(predictions.traffic_type)} confidence={predictionConfidence(predictions.traffic_type, predictions.traffic_confidence)} color="green" />
        <PredictionCard icon={LockKeyhole} title="Encryption" value={predictionValue(predictions.cipher)} confidence={predictionConfidence(predictions.cipher, predictions.cipher_confidence)} color="purple" />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.2fr)]">
        <SecurityScore score={assessment.score ?? 0} status={status} />
        <div className="rounded-xl border border-soc-border bg-soc-card p-6">
          <div className="mb-5 flex items-center gap-3"><div className="rounded-lg bg-soc-primary/10 p-2 text-soc-primary"><FileText className="h-5 w-5" /></div><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-soc-textMuted">Executive summary</p><h2 className="mt-1 text-lg font-semibold text-soc-text">What the evidence says</h2></div></div>
          <p className="max-w-2xl text-sm leading-7 text-soc-textSecondary">This capture is classified as <strong className="text-soc-text">{predictionValue(predictions.mode)}</strong> traffic with <strong className="text-soc-text">{predictionValue(predictions.cipher)}</strong> encryption. The security posture is currently <strong className={status === 'Secure' ? 'text-soc-success' : status === 'Warning' ? 'text-soc-warning' : 'text-soc-danger'}>{status.toLowerCase()}</strong> at {assessment.score ?? 0} out of 100.</p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4"><div className="rounded-lg bg-soc-background p-3"><p className="text-xs text-soc-textMuted">Findings</p><p className="mt-1 text-xl font-bold text-soc-text">{findings.length}</p></div><div className="rounded-lg bg-soc-background p-3"><p className="text-xs text-soc-textMuted">Actions</p><p className="mt-1 text-xl font-bold text-soc-text">{recommendations.length}</p></div><div className="rounded-lg bg-soc-background p-3"><p className="text-xs text-soc-textMuted">Packets</p><p className="mt-1 text-xl font-bold text-soc-text">{features.packet_count?.toLocaleString() || 'N/A'}</p></div><div className="rounded-lg bg-soc-background p-3"><p className="text-xs text-soc-textMuted">Key size</p><p className="mt-1 text-xl font-bold text-soc-text">{config.key_size_bits ? `${config.key_size_bits}b` : 'N/A'}</p></div></div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2"><FeaturePanel features={features} /><SecurityConfig config={config} /></div>
      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2"><ConfidenceChart predictions={predictions} /><TrafficChart features={features} /></div>
      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2"><Findings findings={findings} /><Recommendations recommendations={recommendations} /></div>
      <TechnicalDetails analysis={analysis} features={features} />
    </div>
  );
};

export default AnalysisResultProduct;
