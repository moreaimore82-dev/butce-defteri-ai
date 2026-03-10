import { getKrediBadgeClass } from '../utils/formatters';
import { hesaplaAylikKMHFaizi } from '../utils/calculations';

function getKrediIcon(kredi) {
  if (kredi.includes('Vadesiz')) return 'fa-money-bill-wave text-emerald-500';
  if (kredi.includes('Taksitli')) return 'fa-hand-holding-dollar text-purple-500';
  if (kredi.includes('KMH')) return 'fa-scale-unbalanced text-orange-500';
  if (kredi.includes('Kart')) return 'fa-credit-card text-rose-500';
  return 'fa-wallet text-blue-500';
}

export default function FinancialStatusModal({ onClose, bakiyeler, loglar, kmhFaizOrani, setKmhFaizOrani }) {
  const hesaplar = Object.values(bakiyeler).sort((a, b) => a.banka.localeCompare(b.banka));
  const netVarlik = hesaplar.reduce((sum, h) => sum + h.bakiye, 0);
  const netVarlikFormat = netVarlik.toLocaleString('tr-TR');

  const varlikEl = netVarlik > 0
    ? <span>Net Durum: <span className="text-success">+{netVarlikFormat} ₺</span></span>
    : netVarlik < 0
      ? <span>Net Durum: <span className="text-danger">{netVarlikFormat} ₺</span></span>
      : <span>Net Durum: <span className="text-gray-600 dark:text-gray-400">0.00 ₺</span></span>;

  const krediTurleriToplam = {};
  hesaplar.forEach(h => {
    if (!krediTurleriToplam[h.kredi]) krediTurleriToplam[h.kredi] = 0;
    krediTurleriToplam[h.kredi] += h.bakiye;
  });

  const kmhRows = hesaplar
    .filter(h => h.kredi.includes('KMH'))
    .map(h => ({ h, faiz: hesaplaAylikKMHFaizi(loglar, `${h.banka}|${h.kredi}`, kmhFaizOrani) }))
    .filter(r => r.faiz > 0);
  const totalKmhFaiz = kmhRows.reduce((s, r) => s + r.faiz, 0);

  const handleKmhFaizChange = (e) => {
    let val = e.target.value.replace(/[^0-9,]/g, '');
    const parts = val.split(',');
    if (parts.length > 2) val = parts[0] + ',' + parts.slice(1).join('');
    const parsed = parseFloat(val.replace(',', '.'));
    if (!isNaN(parsed) && parsed >= 0) setKmhFaizOrani(parsed);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 z-50 flex items-start pt-16 sm:pt-24 justify-center backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 w-11/12 md:w-3/4 lg:w-2/3 max-h-[85vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-slate-700 my-8">
        <div className="bg-primary text-white p-4 flex justify-between items-center shrink-0">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <i className="fa-solid fa-chart-pie text-success"></i> Detaylı Finansal Durum
          </h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white text-2xl leading-none transition-colors">&times;</button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-grow bg-gray-50 dark:bg-slate-900">
          {/* Tüm Hesaplar */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 bg-gray-100 dark:bg-slate-900 border-b dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-800 dark:text-white uppercase flex items-center gap-2">
                <i className="fa-solid fa-list-check text-info"></i> Tüm Hesaplar
              </h3>
              <div className="text-sm font-bold bg-white dark:bg-slate-800 px-3 py-1 rounded shadow-sm border dark:border-slate-600">{varlikEl}</div>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-400 text-xs uppercase border-b dark:border-slate-700">
                  <tr>
                    <th className="p-3">Banka Adı</th>
                    <th className="p-3">Hesap Türü</th>
                    <th className="p-3 text-right">Güncel Bakiye</th>
                  </tr>
                </thead>
                <tbody className="text-sm dark:text-gray-300">
                  {hesaplar.length === 0
                    ? <tr><td colSpan="3" className="p-6 text-center text-gray-400 dark:text-gray-600 italic">Henüz hesap tanımlanmadı.</td></tr>
                    : hesaplar.map(h => (
                      <tr key={`${h.banka}|${h.kredi}`} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="p-3 font-semibold text-gray-700 dark:text-gray-200">{h.banka}</td>
                        <td className="p-3"><span className={`px-2 py-1 rounded text-xs font-semibold ${getKrediBadgeClass(h.kredi)}`}>{h.kredi}</span></td>
                        <td className={`p-3 text-right font-bold ${h.bakiye < 0 ? 'text-danger' : 'text-success'} font-mono text-base`}>{h.bakiye.toLocaleString('tr-TR')} ₺</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>

          {/* Hesap Türü Dağılımı */}
          <div className="mt-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 bg-gray-100 dark:bg-slate-900 border-b dark:border-slate-700 flex items-center gap-2">
              <i className="fa-solid fa-layer-group text-warning"></i>
              <h3 className="text-sm font-bold text-gray-800 dark:text-white uppercase">Hesap Türü Dağılımı</h3>
            </div>
            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.keys(krediTurleriToplam).length === 0
                ? <div className="text-center text-gray-400 dark:text-gray-600 text-sm italic col-span-full">Henüz hesap tanımlanmadı.</div>
                : Object.entries(krediTurleriToplam).map(([kredi, toplam]) => (
                  <div key={kredi} className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-xl border border-gray-100 dark:border-slate-600 flex flex-col items-center justify-center text-center shadow-sm transition-transform hover:scale-105">
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-full shadow-sm mb-3 border border-gray-100 dark:border-slate-600">
                      <i className={`fa-solid ${getKrediIcon(kredi)} text-2xl`}></i>
                    </div>
                    <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{kredi}</span>
                    <span className={`text-base font-black ${toplam < 0 ? 'text-danger' : 'text-success'} font-mono`}>{toplam.toLocaleString('tr-TR')} ₺</span>
                  </div>
                ))
              }
            </div>
          </div>

          {/* KMH Faiz Projeksiyonu */}
          <div className="mt-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 bg-gray-100 dark:bg-slate-900 border-b dark:border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-scale-unbalanced text-orange-500"></i>
                <h3 className="text-sm font-bold text-gray-800 dark:text-white uppercase">KMH Faiz Projeksiyonu (Bu Ay)</h3>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1 px-3 rounded border dark:border-slate-600 shadow-sm">
                <label className="text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase">Aylık KMH Faizi (%):</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={kmhFaizOrani.toString().replace('.', ',')}
                  onChange={handleKmhFaizChange}
                  className="w-16 p-1 bg-transparent border-b-2 border-orange-300 dark:border-orange-500 text-xs text-center font-black text-orange-600 dark:text-orange-400 focus:outline-none focus:border-info transition-colors"
                />
              </div>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-400 text-[11px] uppercase border-b dark:border-slate-700">
                  <tr>
                    <th className="p-3">Hesap Adı</th>
                    <th className="p-3 text-right">Güncel KMH Borcu</th>
                    <th className="p-3 text-right text-danger">Ay Sonu Tahmini Faiz</th>
                  </tr>
                </thead>
                <tbody className="text-sm dark:text-gray-300">
                  {kmhRows.length === 0
                    ? <tr><td colSpan="3" className="p-6 text-center text-gray-400 dark:text-gray-600 italic">KMH hesabınızda borç bakiyesi bulunmuyor.</td></tr>
                    : <>
                      {kmhRows.map(({ h, faiz }) => (
                        <tr key={`${h.banka}|${h.kredi}`} className="border-b border-gray-100 dark:border-gray-700">
                          <td className="p-3 font-semibold text-gray-700 dark:text-gray-200">
                            <i className="fa-solid fa-building-columns text-gray-400 text-xs mr-1"></i> {h.banka}
                          </td>
                          <td className="p-3 text-right font-bold text-gray-600 dark:text-gray-400 font-mono">
                            {h.bakiye < 0
                              ? `${Math.abs(h.bakiye).toLocaleString('tr-TR')} ₺`
                              : <span className="text-success text-xs">Borç Kapatıldı</span>}
                          </td>
                          <td className="p-3 text-right font-bold text-danger font-mono">
                            +{faiz.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-red-50 dark:bg-red-900/20 font-bold border-t-2 border-red-200 dark:border-red-900">
                        <td colSpan="2" className="p-3 text-right text-gray-700 dark:text-gray-300">AY SONU EKLENECEK TOPLAM FAİZ:</td>
                        <td className="p-3 text-right text-danger font-black font-mono tracking-wide">
                          +{totalKmhFaiz.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                        </td>
                      </tr>
                    </>
                  }
                </tbody>
              </table>
              <div className="p-3 bg-orange-50 dark:bg-slate-800/80 text-[10px] text-gray-600 dark:text-gray-400 border-t dark:border-slate-700 flex gap-2">
                <i className="fa-solid fa-circle-info mt-0.5 text-orange-500"></i>
                <p>TCMB formülüne göre %15 KKDF ve %15 BSMV dâhil edilerek hesaplanmıştır. İçinde bulunduğumuz ayın son gününe kadarki projeksiyonu yansıtır.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
