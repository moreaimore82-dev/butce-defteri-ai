export default function CustomDialog({ dialog, onClose }) {
  const { type, title, message, isError, onConfirm } = dialog;

  const iconEl = type === 'confirm'
    ? <i className="fa-solid fa-circle-question text-warning text-3xl mt-1"></i>
    : isError
      ? <i className="fa-solid fa-circle-exclamation text-danger text-3xl mt-1"></i>
      : <i className="fa-solid fa-circle-info text-info text-3xl mt-1"></i>;

  const handleConfirm = () => {
    onClose();
    if (onConfirm) onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 z-[100] flex items-start pt-24 justify-center backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 w-11/12 md:w-1/3 rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-slate-700">
        <div className="p-5 flex items-start gap-4">
          <div>{iconEl}</div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-slate-900 p-4 flex justify-end gap-3 border-t dark:border-slate-700">
          {type === 'confirm' && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-gray-200 rounded text-sm font-bold transition"
            >
              İptal
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 ${type === 'confirm' ? 'bg-danger hover:bg-red-600' : 'bg-info hover:bg-blue-600'} text-white rounded text-sm font-bold transition`}
          >
            {type === 'confirm' ? 'Evet, İptal Et' : 'Tamam'}
          </button>
        </div>
      </div>
    </div>
  );
}
