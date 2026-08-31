import StatusBadge from './StatusBadge';

// Dipake admin buat Reservasi & Order sekaligus - bedanya cuma data & pilihan status
function AdminStatusList({ items, statusOptions, onUpdateStatus, renderLabel }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id} className="flex items-center justify-between text-sm border-b border-gray-100 py-2 gap-2">
          <span className="flex-1">{renderLabel(item)}</span>
          <StatusBadge status={item.status} />
          <select
            value={item.status}
            onChange={(e) => onUpdateStatus(item.id, e.target.value)}
            className="border border-gray-300 rounded-lg text-xs px-2 py-1"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </li>
      ))}
    </ul>
  );
}

export default AdminStatusList;
