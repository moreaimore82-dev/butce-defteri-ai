import { useEffect, useState } from 'react';
import { useInstallPWA } from '../hooks/useInstallPWA';

export default function Header({ isDark, toggleTheme }) {
  const [dateStr, setDateStr] = useState('');
  const { isInstallable, isInstalled, install } = useInstallPWA();

  useEffect(() => {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setDateStr(today.toLocaleDateString('tr-TR', options));
  }, []);

  return (
    <header className="bg-primary text-white shadow-lg z-10 border-b border-secondary">
      {/* Install Banner - mobilde üstte tam genişlik */}
      {isInstallable && !isInstalled && (
        <div className="bg-gradient-to-r from-info to-blue-700 px-4 py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm">
            <i className="fa-solid fa-mobile-screen-button text-white text-lg"></i>
            <span className="font-semibold">Uygulamayı telefonuna yükle, çevrimdışı çalışır!</span>
          </div>
          <button
            onClick={install}
            className="bg-white text-info font-black text-xs px-3 py-1.5 rounded-lg shadow-md hover:bg-blue-50 transition-all shrink-0 flex items-center gap-1.5"
          >
            <i className="fa-solid fa-download"></i>
            <span>Yükle</span>
          </button>
        </div>
      )}

      {isInstalled && (
        <div className="bg-success/20 border-b border-success/30 px-4 py-1.5 flex items-center gap-2 text-xs text-success">
          <i className="fa-solid fa-circle-check"></i>
          <span>Uygulama cihazına kuruldu!</span>
        </div>
      )}

      <div className="container mx-auto p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold flex items-center gap-2 tracking-wide">
          <i className="fa-solid fa-microchip text-info"></i>
          <span>Bütçe Defteri <span className="text-info font-black">AI</span></span>
        </h1>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Masaüstünde install butonu - header içinde */}
          {isInstallable && !isInstalled && (
            <button
              onClick={install}
              className="hidden md:flex items-center gap-2 bg-info hover:bg-blue-600 text-white px-3 py-2 rounded-lg shadow-md font-bold text-sm transition transform hover:scale-105"
              title="Uygulamayı bilgisayarına yükle"
            >
              <i className="fa-solid fa-download"></i>
              <span>Uygulamayı Yükle</span>
            </button>
          )}

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
