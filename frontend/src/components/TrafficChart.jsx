import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const TrafficChart = ({ features }) => {
  const points = features?.packet_series || features?.traffic_series;
  if (!Array.isArray(points) || points.length === 0) return null;

  return (
    <section className="rounded-2xl border border-soc-border bg-gradient-to-br from-[#1C3026] to-[#14221C] p-6 shadow-lg shadow-[#102019]/20">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-soc-textMuted">Packet telemetry</p>
        <h2 className="mt-1 text-lg font-semibold text-soc-text">Traffic timeline</h2>
      </div>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points}>
            <defs><linearGradient id="trafficFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22C55E" stopOpacity={0.34} /><stop offset="100%" stopColor="#22C55E" stopOpacity={0.02} /></linearGradient></defs>
            <CartesianGrid stroke="#2C4739" vertical={false} />
            <XAxis dataKey="index" tick={{ fill: '#C5D5CA', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#C5D5CA', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#17251F', border: '1px solid #40604D', borderRadius: 10, color: '#F7FBF8', boxShadow: '0 8px 22px rgba(16,32,25,0.28)' }} />
            <Area type="monotone" dataKey="length" stroke="#4ADE80" fill="url(#trafficFill)" strokeWidth={2.5} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default TrafficChart;
