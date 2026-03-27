export default function FilterModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="card-ui w-full max-w-xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Dashboard Filters</h3>
          <button className="btn-outline" onClick={onClose}>Close</button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-slate-600">
            State
            <select className="input-ui mt-1">
              <option>All States</option>
            </select>
          </label>

          <label className="text-sm text-slate-600">
            District
            <select className="input-ui mt-1">
              <option>All Districts</option>
            </select>
          </label>

          <label className="text-sm text-slate-600">
            Severity
            <select className="input-ui mt-1">
              <option>All</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </label>

          <label className="text-sm text-slate-600">
            Date Range
            <input type="date" className="input-ui mt-1" />
          </label>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button className="btn-outline" onClick={onClose}>Reset</button>
          <button className="btn-primary" onClick={onClose}>Apply</button>
        </div>
      </div>
    </div>
  );
}