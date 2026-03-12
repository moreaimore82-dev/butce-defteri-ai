import { getKrediBadgeClass } from '../utils/formatters';

export default function BalanceTable({ bakiyeler }) {
  const hesaplar = Object.values(bakiyeler).sort((a, b) => a.banka.localeCompare(b.banka));
  const netVarlik = hesaplar.reduce((sum, h) => sum + h.bakiye, 0);
  const netVarlikFormat = netVarlik.toLocaleString('tr-TR');

  const varlikEl = netVarlik > 0
    ? <span>Net Durum: <span className="text-success">+{netVarlikFormat} ₺</span></span>
    : netVarlik < 0
      ? <span>Net Durum: <span className="text-danger">{netVarlikFormat} ₺</span></span>
      : <span>Net Durum: <span className="text-gray-600 dark:text-gray-400">0.00 ₺</span></span>;

  return (
    <div className="glass-panel rounded-xl shadow-lg p-0 flex-grow flex flex-col overflow-hidden border-t-4 border-t-secondary min-h-48 md:min-h-0">
      <div className="p-4 bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <i className="fa-solid fa-chart-pie text-info"></i> Güncel Varlık Dağılımı
        </h2>
        <div className="text-sm font-bold bg-white dark:bg-slate-900 px-3 py-1 rounded border dark:border-gray-600 shadow-sm">
          {varlikEl}
        </div>
      </div>
      <div className="overflow-y-auto custom-scrollbar flex-grow p-0">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 dark:bg-slate-900 text-gray-600 dark:text-gray-400 sticky top-0 shadow-sm text-xs uppercase z-10">
            <tr>
              <th className="p-3 border-b dark:border-gray-700">Banka Adı</th>
              <th className="p-3 border-b dark:border-gray-700">Eylem Türü</th>
              <th className="p-3 border-b dark:border-gray-700 text-right">Güncel Bakiye</th>
              <th className="p-3 border-b dark:border-gray-700 text-center w-16">Durum</th>
            </tr>
          </thead>
          <tbody className="text-sm dark:text-gray-300">
            {hesaplar.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-400 dark:text-gray-600 italic">
                  <i className="fa-solid fa-database text-3xl mb-2 block"></i>
                  Henüz kayıtlı hesap bulunmamaktadır.
                </td>
              </tr>
            ) : (
              hesaplar.map(h => {
                const isNeg = h.bakiye < 0;
                const bakiyeRenk = isNeg ? 'text-danger' : 'text-success';
                const krediBadgeClass = getKrediBadgeClass(h.kredi);
                return (
                  <tr key={`${h.banka}|${h.kredi}`} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="p-3 font-semibold text-gray-700 dark:text-gray-200">{h.banka}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${krediBadgeClass}`}>{h.kredi}</span>
                    </td>
                    <td className={`p-3 text-right font-bold ${bakiyeRenk} font-mono text-base`}>
                      {h.bakiye.toLocaleString('tr-TR')} ₺
                    </td>
                    <td className="p-3 text-center bg-gray-50 dark:bg-slate-800">
                      {h.bakiye === 0
                        ? <i className="fa-solid fa-minus text-gray-400"></i>
                        : isNeg
                          ? <i className="fa-solid fa-arrow-down text-danger"></i>
                          : <i className="fa-solid fa-arrow-up text-success"></i>
                      }
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
