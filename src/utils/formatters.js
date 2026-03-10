export function parseTutarStr(valStr) {
  if (!valStr) return NaN;
  const cleaned = valStr.replace(/\./g, '');
  return parseInt(cleaned, 10);
}

export function floatToInputStr(num) {
  if (isNaN(num)) return '';
  const isNegative = num < 0;
  const result = Math.abs(Math.round(num)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return isNegative ? '-' + result : result;
}

export function formatTutarValue(val, isAktarmaField = false) {
  let isNegative = val.startsWith('-');
  if (isAktarmaField) {
    isNegative = false;
    val = val.replace(/-/g, '');
  }
  val = val.replace(/[^0-9]/g, '');
  if (val) {
    val = val.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  if (isNegative && val) return '-' + val;
  if (isNegative && !val) return '-';
  return val;
}

export function generateId() {
  return 'tx_' + Math.random().toString(36).substr(2, 9);
}

export function formatDisplayDate(dateStr) {
  const t = new Date(dateStr);
  return `${t.getDate().toString().padStart(2, '0')}.${(t.getMonth() + 1).toString().padStart(2, '0')}.${t.getFullYear()}`;
}

export function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

export function getKrediBadgeClass(kredi) {
  if (kredi.includes('Vadesiz')) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
  if (kredi.includes('Taksitli')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
  if (kredi.includes('KMH')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
  if (kredi.includes('Kart')) return 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200';
  return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
}
