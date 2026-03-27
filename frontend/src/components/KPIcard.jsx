const toneMap = {
  blue: "text-blue-600 bg-blue-50",
  green: "text-emerald-600 bg-emerald-50",
  orange: "text-amber-600 bg-amber-50",
  red: "text-rose-600 bg-rose-50",
};

export default function KPIcard({ label, value, tone = "blue", delta = "" }) {
  return (
    <div className="card-ui p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
        </div>
        <span className={`rounded-lg px-2 py-1 text-xs font-semibold ${toneMap[tone]}`} title={`${label} trend`}>
          {delta || "Live"}
        </span>
      </div>
    </div>
  );
}