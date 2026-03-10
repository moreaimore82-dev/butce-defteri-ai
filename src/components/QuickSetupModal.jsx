import { BANKS, ACCOUNT_TYPES } from '../constants';
import { formatTutarValue } from '../utils/formatters';

export default function QuickSetupModal({ onClose, modalBanka, setModalBanka, modalKredi, setModalKredi, modalTutar, setModalTutar, hizliHesapEkle }) {
  const inputBase = 'w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-gray-50 dark:bg-slate-700 dark:text-white';

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 z-50 flex items-start pt-16 sm:pt-24 justify-center backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 w-11/12 md:w-3/4 lg:w-2/3 max-h-[85vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-slate-700 my-8">
        <div className="bg-primary text-white p-4 flex justify-between items-center shrink-0">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <i className="fa-solid fa-bolt text-warning"></i> Hızlı Başlangıç Bakiyesi Ekle
          </h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white text-2xl leading-none transition-colors">&times;</button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar flex-grow bg-gray-50 dark:bg-slate-900">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-grow w-full md:w-auto">
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Banka Adı</label>
                <select value={modalBanka} onChange={e => setModalBanka(e.target.value)} className={inputBase}>
                  <option value="" disabled>Banka Seçiniz</option>
                  {BANKS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                </select>
              </div>
              <div className="flex-grow w-full md:w-auto">
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Hesap Türü</label>
                <select value={modalKredi} onChange={e => setModalKredi(e.target.value)} className={inputBase}>
                  {ACCOUNT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="w-full md:w-1/4 relative">
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Bakiye (TL)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={modalTutar}
                  onChange={e => setModalTutar(formatTutarValue(e.target.value))}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm text-right font-bold text-gray-800 dark:text-white bg-gray-50 dark:bg-slate-700"
                  placeholder="0"
                />
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 absolute whitespace-nowrap">Borç ise eksi (-) girin.</p>
              </div>
              <div className="w-full md:w-auto mt-6 md:mt-0">
                <button
                  onClick={hizliHesapEkle}
                  className="w-full bg-success hover:bg-green-600 text-white px-6 py-2 rounded text-sm font-bold shadow transition flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-plus"></i> Ekle
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
