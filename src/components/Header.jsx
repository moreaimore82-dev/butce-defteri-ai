import { useEffect, useState } from 'react';

export default function Header({ isDark, toggleTheme }) {
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setDateStr(today.toLocaleDateString('tr-TR', options));
  }, []);

  return (
    <header className="bg-primary text-white p-4 shadow-lg z-10 border-b border-secondary">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold flex items-center gap-2 tracking-wide">
          <i className="fa-solid fa-microchip text-info"></i> Bütçe Defteri <span className="text-info font-black">AI</span>
        </h1>
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={toggleTheme}
            className="bg-secondary hover:bg-slate-600 border border-gray-600 text-white px-3 py-2 rounded-lg shadow-md font-bold text-sm flex items-center justify-center transition transform hover:scale-105 w-9 h-9"
            title="Açık/Koyu Tema Değiştir"
          >
            <i className={`fa-solid ${isDark ? 'fa-sun text-yellow-400' : 'fa-moon text-slate-200'}`}></i>
          </button>
          <div className="text-sm opacity-80 hidden lg:block">{dateStr}</div>
        </div>
      </div>
    </header>
  );
}
