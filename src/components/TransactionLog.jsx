import { formatDisplayDate } from '../utils/formatters';

export default function TransactionLog({ loglar, islemSil, islemDuzenle }) {
  const son20 = [...loglar].slice(-20).reverse();

  return (
    <div className="glass-panel rounded-xl shadow p-4 h-64 flex flex-col overflow-hidden border-t-4 border-t-gray-400 dark:border-t-slate-600">
      <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase mb-3 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
        <i className="fa-solid fa-list-ul"></i> İşlem Geçmişi (Son 20)
      </h3>
      <ul className="overflow-y-auto custom-scrollbar flex-grow space-y-2 pr-2">
        {son20.length === 0 ? (
          <li className="text-center text-gray-400 dark:text-gray-600 text-sm italic py-4">İşlem geçmişi boş.</li>
        ) : (
          son20.map(log => (
            <li key={log.id} className="bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded p-3 text-sm flex gap-3 items-start shadow-sm">
              <div className={`${log.badgeClass} text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-md border border-white/20`}>
                <i className={`fa-solid ${log.iconClass} text-xs`}></i>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-gray-700 dark:text-gray-200 text-xs uppercase tracking-wider">{log.islemTuru}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    <i className="fa-regular fa-calendar"></i> {formatDisplayDate(log.tarih)}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-xs" dangerouslySetInnerHTML={{ __html: log.detay }} />
                <div className="flex justify-end gap-3 border-t dark:border-slate-700 pt-2 mt-2">
                  <button onClick={() => islemDuzenle(log.id)} className="text-[11px] text-info hover:text-blue-400 font-bold transition flex items-center gap-1">
                    <i className="fa-solid fa-pen"></i> Düzelt
                  </button>
                  <button onClick={() => islemSil(log.id)} className="text-[11px] text-danger hover:text-red-400 font-bold transition flex items-center gap-1">
                    <i className="fa-solid fa-trash"></i> İptal
                  </button>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
