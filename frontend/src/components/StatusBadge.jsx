const STATUS_CLASSES = {
  menunggu: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  dikonfirmasi: 'bg-green-100 text-green-700 border-green-300',
  dibatalkan: 'bg-red-100 text-red-700 border-red-300',
  baru: 'bg-gray-100 text-gray-600 border-gray-300',
  diproses: 'bg-blue-100 text-blue-700 border-blue-300',
  siap: 'bg-purple-100 text-purple-700 border-purple-300',
  selesai: 'bg-green-100 text-green-700 border-green-300',
};

// Satu badge status dipakai bareng buat Reservasi & Order (nilai enum beda tapi tampilannya sama)
function StatusBadge({ status }) {
  const classes = STATUS_CLASSES[status] || 'bg-gray-100 text-gray-600 border-gray-300';
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full border ${classes}`}>
      {status}
    </span>
  );
}

export default StatusBadge;
