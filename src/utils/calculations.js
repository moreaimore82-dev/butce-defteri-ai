export function getEndOfDayBalance(loglar, hesapKey, targetDateStr) {
  let bakiye = 0;
  for (const log of loglar) {
    if (log.tarih <= targetDateStr) {
      const r = log.raw;
      if (r.kaynakKey === hesapKey) {
        if (r.tip === 'İlave' || r.tip === 'Açılış (Alacak)') bakiye += r.tutar;
        else if (r.tip === 'Harcama' || r.tip === 'Açılış (Borç)' || r.tip === 'Aktarma') bakiye -= r.tutar;
      }
      if (r.hedefKey === hesapKey && r.tip === 'Aktarma') {
        bakiye += r.tutar;
      }
    }
  }
  return bakiye;
}

export function hesaplaAylikKMHFaizi(loglar, hesapKey, kmhFaizOrani) {
  let totalInterest = 0;
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();

  for (let day = 1; day <= lastDay; day++) {
    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${currentYear}-${monthStr}-${dayStr}`;
    const endOfDayBalance = getEndOfDayBalance(loglar, hesapKey, dateStr);
    if (endOfDayBalance < 0) {
      const anaPara = Math.abs(endOfDayBalance);
      totalInterest += anaPara * (kmhFaizOrani / 100) / 30;
    }
  }
  return totalInterest * 1.30;
}

export function calcMemoryUsage(bakiyeler, loglar) {
  const dataStr = JSON.stringify({ bakiyeler, loglar });
  const bytes = new Blob([dataStr]).size;
  const maxBytes = 5 * 1024 * 1024;
  const pct = parseFloat(((bytes / maxBytes) * 100).toFixed(2));
  const kb = (bytes / 1024).toFixed(1);
  return { pct, kb };
}
