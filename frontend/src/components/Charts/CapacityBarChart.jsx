import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function CapacityBarChart({ data }) {
  return (
    <div className="card-ui h-80 p-4">
      <h3 className="mb-4 text-sm font-semibold text-slate-800">Shelter Capacity Snapshot</h3>
      <ResponsiveContainer width="100%" height="88%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip />
          <Bar dataKey="available" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          <Bar dataKey="occupied" fill="#ef4444" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}