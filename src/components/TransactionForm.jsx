import { BANKS, ACCOUNT_TYPES } from '../constants';
import { formatTutarValue, parseTutarStr } from '../utils/formatters';

function BankSelect({ value, onChange, className, required }) {
  return (
    <select value={value} onChange={onChange} required={required} className={className}>
      <option value="" disabled>Banka Seçiniz</option>
      {BANKS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
    </select>
  );
}

function AccountTypeSelect({ value, onChange, className }) {
  return (
    <select value={value} onChange={onChange} className={className}>
      {ACCOUNT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
    </select>
  );
}

export default function TransactionForm({
  tarih, setTarih,
  isAktarma, setIsAktarma,
  kaynakBanka, setKaynakBanka,
  kaynakKredi, setKaynakKredi,
  tutar, setTutar,
  hedefBanka, setHedefBanka,
  hedefKredi, setHedefKredi,
  islemKaydet,
  btnSaved,
}) {
  const inputBase = 'w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-slate-700 dark:text-white';

  const tutarNum = tutar ? parseTutarStr(tutar) : NaN;
  const tutarColor = isAktarma
    ? 'text-warning'
    : !isNaN(tutarNum) && tutarNum !== 0
      ? tutarNum > 0 ? 'text-success' : 'text-danger'
      : 'text-gray-800 dark:text-white';

  return (
    <div className="w-full md:w-1/3 glass-panel rounded-xl shadow-2xl p-6 flex flex-col h-full overflow-y-auto custom-scrollbar border-t-4 border-t-info">
      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4 flex items-center gap-2">
        <i className="fa-solid fa-plus-circle text-info"></i> Yeni İşlem Ekle
      </h2>

      <div className="flex flex-col gap-4">
        {/* Tarih ve Transfer toggle */}
        <div className="flex gap-4 items-end">
          <div className="w-1/2">
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase mb-1">Tarih</label>
            <input
              type="date"
              value={tarih}
              onChange={e => setTarih(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-slate-700 text-sm dark:text-white"
            />
          </div>
          <div className="w-1/2 flex items-center h-[38px]">
            <label className="flex items-center cursor-pointer" title="Farklı bir hesaba para aktarmak için aktifleştirin">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isAktarma}
                  onChange={e => setIsAktarma(e.target.checked)}
                />
                <div className={`block w-10 h-6 rounded-full transition-colors duration-300 ${isAktarma ? 'bg-warning' : 'bg-gray-300 dark:bg-slate-600'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow ${isAktarma ? 'translate-x-full' : ''}`}></div>
              </div>
              <div className="ml-3 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase">Transfer Yap</div>
            </label>
          </div>
        </div>

        {/* Kaynak Hesap */}
        <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded border border-gray-200 dark:border-gray-700">
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 flex items-center gap-1">
            <i className="fa-solid fa-arrow-right-from-bracket"></i> Kaynak Hesap
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Banka Adı</label>
              <BankSelect value={kaynakBanka} onChange={e => setKaynakBanka(e.target.value)} required className={inputBase} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Hesap Türü</label>
              <AccountTypeSelect value={kaynakKredi} onChange={e => setKaynakKredi(e.target.value)} className={inputBase} />
            </div>
          </div>
        </div>

        {/* Tutar */}
        <div className="flex flex-col">
          <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase mb-1">Tutar (TL)</label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400 font-bold">₺</span>
            <input
              type="text"
              inputMode="numeric"
              value={tutar}
              onChange={e => setTutar(formatTutarValue(e.target.value, isAktarma))}
              placeholder="0"
              required
              className={`w-full p-2 pl-8 border border-gray-300 dark:border-gray-600 dark:bg-slate-700 rounded text-lg font-bold text-right ${tutarColor}`}
            />
          </div>
        </div>

        {/* Hedef Hesap (Aktarma) */}
        {isAktarma && (
          <div className="bg-orange-50 dark:bg-slate-800 p-3 rounded border border-orange-200 dark:border-gray-600 mt-2">
            <h3 className="text-xs font-bold text-warning uppercase mb-2 flex items-center gap-1">
              <i className="fa-solid fa-arrow-right-to-bracket"></i> Hedef Hesap
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Hedef Banka</label>
                <BankSelect
                  value={hedefBanka}
                  onChange={e => setHedefBanka(e.target.value)}
                  className="w-full p-2 border border-orange-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Hedef Hesap Türü</label>
                <AccountTypeSelect
                  value={hedefKredi}
                  onChange={e => setHedefKredi(e.target.value)}
                  className="w-full p-2 border border-orange-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={islemKaydet}
          className={`mt-4 w-full ${btnSaved ? 'bg-success' : 'bg-info hover:bg-blue-600'} text-white font-bold py-3 px-4 rounded shadow-lg transition duration-200 flex justify-center items-center gap-2`}
        >
          {btnSaved
            ? <><i className="fa-solid fa-check"></i> Sisteme İşlendi!</>
            : <><i className="fa-solid fa-save"></i> İşlemi Sisteme İşle</>
          }
        </button>

        <p className="text-[11px] text-center text-gray-500 dark:text-gray-400 mt-2">
          <i className="fa-solid fa-robot"></i> AI: İşlemleriniz çift taraflı kayıt kuralına göre denetlenir.
        </p>
      </div>
    </div>
  );
}
