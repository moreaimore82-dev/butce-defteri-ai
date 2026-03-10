import { calcMemoryUsage } from '../utils/calculations';

export default function Footer({ bakiyeler, loglar, verileriSifirla }) {
  const percentage = calcMemoryUsage(bakiyeler, loglar);
  const pct = parseFloat(percentage);
  const colorClass = pct > 80 ? 'text-danger' : pct > 50 ? 'text-warning' : 'text-success';
  const barClass = pct > 80 ? 'bg-danger' : pct > 50 ? 'bg-warning' : 'bg-success';

  return (
    <footer className="bg-primary border-t border-secondary text-gray-300 text-[11px] py-1 px-4 flex justify-between items-center z-20">
      <div className="flex items-center gap-2">
        <i className="fa-solid fa-brain text-info"></i>
        <span>Bütçe Defteri AI Core v2.0 | Context Hafızası:</span>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={verileriSifirla}
          className="text-danger hover:text-red-400 font-bold flex items-center gap-1 transition-colors"
          title="Tüm verileri sil"
        >
          <i className="fa-solid fa-trash-can"></i> Temizle
        </button>
        <div className="flex items-center gap-2">
          <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${barClass} transition-all duration-500`}
              style={{ width: `${Math.min(pct * 1000, 100)}%` }}
            ></div>
          </div>
          <span className={`font-bold ${colorClass} w-12 text-right`}>%{percentage}</span>
        </div>
      </div>
    </footer>
  );
}
