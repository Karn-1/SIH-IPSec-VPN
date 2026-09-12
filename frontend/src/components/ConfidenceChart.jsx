import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const ConfidenceChart = ({ predictions }) => {
  const confidence = (prediction) => {
    const value = typeof prediction === 'object' && prediction !== null ? prediction.confidence : prediction;
    return typeof value === 'number' ? Math.round(value <= 1 ? value * 100 : value) : 0;
  };

  const data = [
    { name: 'IPsec mode', confidence: confidence(predictions?.mode) },
    { name: 'Traffic type', confidence: confidence(predictions?.traffic_type) },
    { name: 'Encryption', confidence: confidence(predictions?.cipher) },
  ];

  return (
    <section className="rounded-2xl border border-soc-border bg-gradient-to-br from-[#1C3026] to-[#14221C] p-6 shadow-lg shadow-[#102019]/20">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-soc-textMuted">Model confidence</p>
        <h2 className="mt-1 text-lg font-semibold text-soc-text">AI detection confidence</h2>
      </div>
      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 12, right: 16 }}>
            <CartesianGrid stroke="#2C4739" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fill: '#C5D5CA', fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
            <YAxis type="category" dataKey="name" width={82} tick={{ fill: '#C5D5CA', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(value) => [`${value}%`, 'Confidence']} contentStyle={{ background: '#17251F', border: '1px solid #40604D', borderRadius: 10, color: '#F7FBF8', boxShadow: '0 8px 22px rgba(16,32,25,0.28)' }} />
            <Bar dataKey="confidence" fill="#22C55E" radius={[0, 7, 7, 0]} barSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default ConfidenceChart;
