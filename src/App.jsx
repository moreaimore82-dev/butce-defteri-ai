import { useState, useEffect } from 'react';
import Header from './components/Header';
import TransactionForm from './components/TransactionForm';
import BalanceTable from './components/BalanceTable';
import TransactionLog from './components/TransactionLog';
import Footer from './components/Footer';
import QuickSetupModal from './components/QuickSetupModal';
import FinancialStatusModal from './components/FinancialStatusModal';
import CustomDialog from './components/CustomDialog';
import { parseTutarStr, floatToInputStr, generateId, getTodayStr } from './utils/formatters';

const STORAGE_KEY = 'butceDefteriData';
const THEME_KEY = 'butceDefteriTheme';

export default function App() {
  const [bakiyeler, setBakiyeler] = useState({});
  const [loglar, setLoglar] = useState([]);
  const [islemSayaci, setIslemSayaci] = useState(0);
  const [kmhFaizOrani, setKmhFaizOrani] = useState(4.25);
  const [isDark, setIsDark] = useState(true);
  const [showKurulumModal, setShowKurulumModal] = useState(false);
  const [showDurumModal, setShowDurumModal] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [sonIslemDetay, setSonIslemDetay] = useState(null);

  const [tarih, setTarih] = useState(getTodayStr());
  const [isAktarma, setIsAktarma] = useState(false);
  const [kaynakBanka, setKaynakBanka] = useState('');
  const [kaynakKredi, setKaynakKredi] = useState('Vadesiz');
  const [tutar, setTutar] = useState('');
  const [hedefBanka, setHedefBanka] = useState('');
  const [hedefKredi, setHedefKredi] = useState('Vadesiz');
  const [btnSaved, setBtnSaved] = useState(false);

  const [modalBanka, setModalBanka] = useState('');
  const [modalKredi, setModalKredi] = useState('Vadesiz');
  const [modalTutar, setModalTutar] = useState('');

  // Load from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    setIsDark(savedTheme !== 'light');

    const dataStr = localStorage.getItem(STORAGE_KEY);
    if (dataStr) {
      try {
        const data = JSON.parse(dataStr);
        setBakiyeler(data.bakiyeler || {});
        setLoglar(data.loglar || []);
        setIslemSayaci(data.islemSayaci || 0);
        if (data.kmhFaizOrani !== undefined) setKmhFaizOrani(data.kmhFaizOrani);
        if (data.loglar && data.loglar.length > 0) {
          setSonIslemDetay(data.loglar[data.loglar.length - 1].detay);
        }
      } catch (e) {
        console.error('Veri yükleme hatası', e);
      }
    }
  }, []);

  // Sync dark mode with DOM
  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ bakiyeler, loglar, islemSayaci, kmhFaizOrani }));
  }, [bakiyeler, loglar, islemSayaci, kmhFaizOrani]);

  // Sync son işlem detay
  useEffect(() => {
    if (loglar.length > 0) setSonIslemDetay(loglar[loglar.length - 1].detay);
  }, [loglar]);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem(THEME_KEY, newDark ? 'dark' : 'light');
  };

  const showAlert = (message, title = 'Uyarı', isError = true) => {
    setDialog({ type: 'alert', message, title, isError });
  };

  const showConfirm = (message, onConfirm, title = 'Onay Gerekli') => {
    setDialog({ type: 'confirm', message, title, onConfirm });
  };

  const verileriSifirla = () => {
    showConfirm(
      'Tüm bütçe verileriniz, geçmişiniz ve bakiyeleriniz kalıcı olarak silinecek. Emin misiniz?',
      () => {
        setBakiyeler({});
        setLoglar([]);
        setIslemSayaci(0);
        setSonIslemDetay(null);
        localStorage.removeItem(STORAGE_KEY);
        showAlert('Tüm veriler başarıyla sıfırlandı.', 'Temizlendi', false);
      },
      'Verileri Sıfırla'
    );
  };

  const hizliHesapEkle = () => {
    if (!modalBanka) { showAlert('Lütfen bir banka seçin ve geçerli bir bakiye tutarı girin.'); return; }
    let tutarVal = parseTutarStr(modalTutar);
    if (isNaN(tutarVal)) { showAlert('Lütfen bir banka seçin ve geçerli bir bakiye tutarı girin.'); return; }
    if (modalKredi === 'Kredi Kartı' && tutarVal > 0) tutarVal = -Math.abs(tutarVal);

    const key = `${modalBanka}|${modalKredi}`;
    const newBakiyeler = { ...bakiyeler };
    if (!newBakiyeler[key]) newBakiyeler[key] = { banka: modalBanka, kredi: modalKredi, bakiye: 0 };
    if (modalKredi === 'Kredi Kartı' && newBakiyeler[key].bakiye + tutarVal > 0) {
      showAlert('Kural Hatası: Kredi Kartı bakiyesi pozitif (+) olamaz.'); return;
    }
    newBakiyeler[key] = { ...newBakiyeler[key], bakiye: newBakiyeler[key].bakiye + tutarVal };

    const isNegative = tutarVal < 0;
    const textClass = isNegative ? 'text-danger' : 'text-success';
    const detay = `<span class="font-bold dark:text-gray-200">${modalBanka} (${modalKredi})</span> hesabı için <span class="font-bold ${textClass}">${Math.abs(tutarVal).toLocaleString('tr-TR')} TL</span> başlangıç bakiyesi tanımlandı.`;

    const newLog = {
      id: generateId(), tarih,
      islemTuru: isNegative ? 'Açılış (Borç)' : 'Açılış (Alacak)',
      tutar: Math.abs(tutarVal), detay,
      badgeClass: isNegative ? 'bg-danger' : 'bg-success',
      iconClass: isNegative ? 'fa-minus' : 'fa-plus',
      raw: { tip: isNegative ? 'Açılış (Borç)' : 'Açılış (Alacak)', kaynakKey: key, kaynakBanka: modalBanka, kaynakKredi: modalKredi, tutar: Math.abs(tutarVal), orjinalTutar: tutarVal }
    };

    setBakiyeler(newBakiyeler);
    setLoglar(prev => [...prev, newLog]);
    setIslemSayaci(prev => prev + 1);
    setModalTutar('');
    setShowKurulumModal(false);
    showAlert('Başlangıç bakiyesi başarıyla eklendi.', 'Başarılı', false);
  };

  const islemKaydet = () => {
    let tutarVal = parseTutarStr(tutar);
    if (isAktarma) tutarVal = Math.abs(tutarVal);
    if (!tarih || !kaynakBanka || isNaN(tutarVal) || tutarVal === 0) {
      showAlert('Lütfen Banka adını ve geçerli bir tutar giriniz (Sıfırdan farklı).'); return;
    }

    const kaynakKey = `${kaynakBanka}|${kaynakKredi}`;
    const newBakiyeler = { ...bakiyeler };
    if (!newBakiyeler[kaynakKey]) newBakiyeler[kaynakKey] = { banka: kaynakBanka, kredi: kaynakKredi, bakiye: 0 };

    let detay = '', badgeClass = '', iconClass = '', islemTuruLabel = '';

    if (!isAktarma) {
      if (kaynakKredi === 'Kredi Kartı' && newBakiyeler[kaynakKey].bakiye + tutarVal > 0) {
        showAlert('Kural Hatası: Kredi Kartı bakiyesi hiçbir zaman pozitif (+) olamaz.'); return;
      }
      newBakiyeler[kaynakKey] = { ...newBakiyeler[kaynakKey], bakiye: newBakiyeler[kaynakKey].bakiye + tutarVal };
      if (tutarVal > 0) {
        islemTuruLabel = 'İlave';
        detay = `<span class="font-bold dark:text-gray-200">${kaynakBanka} (${kaynakKredi})</span> hesabına <span class="font-bold text-success">${tutarVal.toLocaleString('tr-TR')} TL</span> ilave edildi.`;
        badgeClass = 'bg-success'; iconClass = 'fa-plus';
      } else {
        islemTuruLabel = 'Harcama';
        detay = `<span class="font-bold dark:text-gray-200">${kaynakBanka} (${kaynakKredi})</span> hesabından <span class="font-bold text-danger">${Math.abs(tutarVal).toLocaleString('tr-TR')} TL</span> harcandı.`;
        badgeClass = 'bg-danger'; iconClass = 'fa-minus';
      }
    } else {
      if (!hedefBanka) { showAlert('Aktarma işlemi için Hedef Banka girilmelidir!'); return; }
      const hedefKey = `${hedefBanka}|${hedefKredi}`;
      if (!newBakiyeler[hedefKey]) newBakiyeler[hedefKey] = { banka: hedefBanka, kredi: hedefKredi, bakiye: 0 };
      if (kaynakKredi === 'Kredi Kartı' && newBakiyeler[kaynakKey].bakiye - tutarVal > 0) {
        showAlert('Kural Hatası: Kaynak Kredi Kartı bakiyesi pozitif (+) olamaz.'); return;
      }
      if (hedefKredi === 'Kredi Kartı' && newBakiyeler[hedefKey].bakiye + tutarVal > 0) {
        showAlert('Kural Hatası: Hedef kredi kartına borcundan fazla para aktaramazsınız.'); return;
      }
      newBakiyeler[kaynakKey] = { ...newBakiyeler[kaynakKey], bakiye: newBakiyeler[kaynakKey].bakiye - tutarVal };
      newBakiyeler[hedefKey] = { ...newBakiyeler[hedefKey], bakiye: newBakiyeler[hedefKey].bakiye + tutarVal };
      islemTuruLabel = 'Aktarma';
      detay = `<span class="font-bold dark:text-gray-200">${kaynakBanka} (${kaynakKredi})</span> hesabından, <span class="font-bold dark:text-gray-200">${hedefBanka} (${hedefKredi})</span> hesabına <span class="font-bold text-warning">${tutarVal.toLocaleString('tr-TR')} TL</span> aktarıldı.`;
      badgeClass = 'bg-warning'; iconClass = 'fa-exchange-alt';
    }

    const hedefKey = isAktarma ? `${hedefBanka}|${hedefKredi}` : null;
    const newLog = {
      id: generateId(), tarih, islemTuru: islemTuruLabel, tutar: Math.abs(tutarVal), detay, badgeClass, iconClass,
      raw: { tip: isAktarma ? 'Aktarma' : (tutarVal > 0 ? 'İlave' : 'Harcama'), kaynakKey, kaynakBanka, kaynakKredi, hedefKey, hedefBanka: isAktarma ? hedefBanka : null, hedefKredi: isAktarma ? hedefKredi : null, tutar: Math.abs(tutarVal), orjinalTutar: tutarVal }
    };

    setBakiyeler(newBakiyeler);
    setLoglar(prev => [...prev, newLog]);
    setIslemSayaci(prev => prev + 1);
    setTutar('');
    setBtnSaved(true);
    setTimeout(() => setBtnSaved(false), 1000);
  };

  const islemSil = (id, sessiz = false) => {
    if (!sessiz) {
      showConfirm('Bu işlemi iptal etmek istediğinize emin misiniz? Bakiye hesaplamaları geri alınacaktır.', () => performDelete(id));
      return;
    }
    performDelete(id);
  };

  const performDelete = (id) => {
    const log = loglar.find(l => l.id === id);
    if (!log) return;
    const raw = log.raw;
    let kaynakFark = 0, hedefFark = 0;
    if (raw.tip === 'İlave' || raw.tip === 'Açılış (Alacak)') kaynakFark = -raw.tutar;
    else if (raw.tip === 'Harcama' || raw.tip === 'Açılış (Borç)') kaynakFark = raw.tutar;
    else if (raw.tip === 'Aktarma') { kaynakFark = raw.tutar; hedefFark = -raw.tutar; }

    const newBakiyeler = { ...bakiyeler };
    if (raw.kaynakKredi === 'Kredi Kartı' && newBakiyeler[raw.kaynakKey].bakiye + kaynakFark > 0) {
      showAlert('İptal Hatası: Bu işlem Kredi Kartı bakiyesini artı duruma düşürüyor.'); return;
    }
    if (raw.tip === 'Aktarma' && raw.hedefKredi === 'Kredi Kartı' && newBakiyeler[raw.hedefKey].bakiye + hedefFark > 0) {
      showAlert('İptal Hatası: Bu işlem Hedef Kredi Kartı bakiyesini artı duruma düşürüyor.'); return;
    }
    newBakiyeler[raw.kaynakKey] = { ...newBakiyeler[raw.kaynakKey], bakiye: newBakiyeler[raw.kaynakKey].bakiye + kaynakFark };
    if (raw.tip === 'Aktarma' && raw.hedefKey) {
      newBakiyeler[raw.hedefKey] = { ...newBakiyeler[raw.hedefKey], bakiye: newBakiyeler[raw.hedefKey].bakiye + hedefFark };
    }
    setBakiyeler(newBakiyeler);
    setLoglar(prev => prev.filter(l => l.id !== id));
  };

  const islemDuzenle = (id) => {
    const log = loglar.find(l => l.id === id);
    if (!log) return;
    const raw = log.raw;
    setTarih(log.tarih);
    if (raw.tip === 'Aktarma') {
      setIsAktarma(true);
      setKaynakBanka(raw.kaynakBanka); setKaynakKredi(raw.kaynakKredi);
      setHedefBanka(raw.hedefBanka); setHedefKredi(raw.hedefKredi);
      setTutar(floatToInputStr(raw.orjinalTutar));
    } else if (raw.tip.includes('Açılış')) {
      setShowKurulumModal(true);
      setModalBanka(raw.kaynakBanka); setModalKredi(raw.kaynakKredi);
      setModalTutar(floatToInputStr(raw.orjinalTutar));
    } else {
      setIsAktarma(false);
      setKaynakBanka(raw.kaynakBanka); setKaynakKredi(raw.kaynakKredi);
      setTutar(floatToInputStr(raw.orjinalTutar));
    }
    // Silently delete and undo balance
    let kaynakFark = 0, hedefFark = 0;
    if (raw.tip === 'İlave' || raw.tip === 'Açılış (Alacak)') kaynakFark = -raw.tutar;
    else if (raw.tip === 'Harcama' || raw.tip === 'Açılış (Borç)') kaynakFark = raw.tutar;
    else if (raw.tip === 'Aktarma') { kaynakFark = raw.tutar; hedefFark = -raw.tutar; }
    const newBakiyeler = { ...bakiyeler };
    newBakiyeler[raw.kaynakKey] = { ...newBakiyeler[raw.kaynakKey], bakiye: newBakiyeler[raw.kaynakKey].bakiye + kaynakFark };
    if (raw.tip === 'Aktarma' && raw.hedefKey) {
      newBakiyeler[raw.hedefKey] = { ...newBakiyeler[raw.hedefKey], bakiye: newBakiyeler[raw.hedefKey].bakiye + hedefFark };
    }
    setBakiyeler(newBakiyeler);
    setLoglar(prev => prev.filter(l => l.id !== id));
  };

  return (
    <div className="bg-gray-100 text-gray-800 dark:bg-darkBg dark:text-gray-100 h-screen flex flex-col overflow-hidden transition-colors duration-300">
      <Header isDark={isDark} toggleTheme={toggleTheme} />

      <main className="flex-grow container mx-auto p-4 flex flex-col gap-5 overflow-y-auto md:overflow-hidden">
        {/* Aksiyon Butonları */}
        <div className="flex flex-row gap-3 shrink-0">
          <button
            onClick={() => setShowKurulumModal(true)}
            className="flex-1 glass-panel bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border-2 border-warning/40 hover:border-warning text-gray-800 dark:text-white px-2 sm:px-4 py-3 sm:py-4 rounded-xl shadow-lg font-bold text-sm sm:text-lg flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 transition-all duration-300 transform hover:-translate-y-1 text-center"
          >
            <div className="bg-warning/20 p-2 rounded-full flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 shrink-0">
              <i className="fa-solid fa-bolt text-warning text-base sm:text-xl"></i>
            </div>
            <span className="leading-tight">Hızlı Kurulum</span>
          </button>
          <button
            onClick={() => setShowDurumModal(true)}
            className="flex-1 glass-panel bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border-2 border-info/40 hover:border-info text-gray-800 dark:text-white px-2 sm:px-4 py-3 sm:py-4 rounded-xl shadow-lg font-bold text-sm sm:text-lg flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 transition-all duration-300 transform hover:-translate-y-1 text-center"
          >
            <div className="bg-info/20 p-2 rounded-full flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 shrink-0">
              <i className="fa-solid fa-chart-pie text-info text-base sm:text-xl"></i>
            </div>
            <span className="leading-tight">Finansal Durum</span>
          </button>
        </div>

        {/* Ana Paneller */}
        <div className="flex flex-col md:flex-row gap-6 md:flex-grow md:overflow-hidden">
          <TransactionForm
            tarih={tarih} setTarih={setTarih}
            isAktarma={isAktarma} setIsAktarma={setIsAktarma}
            kaynakBanka={kaynakBanka} setKaynakBanka={setKaynakBanka}
            kaynakKredi={kaynakKredi} setKaynakKredi={setKaynakKredi}
            tutar={tutar} setTutar={setTutar}
            hedefBanka={hedefBanka} setHedefBanka={setHedefBanka}
            hedefKredi={hedefKredi} setHedefKredi={setHedefKredi}
            islemKaydet={islemKaydet}
            btnSaved={btnSaved}
          />

          <div className="w-full md:w-2/3 flex flex-col gap-4 md:h-full md:overflow-hidden">
            {/* AI Analiz */}
            <div className="glass-panel rounded-xl shadow p-4 border-l-4 border-l-info flex items-start gap-3 shrink-0">
              <div className="text-info text-2xl pt-1"><i className="fa-solid fa-bolt"></i></div>
              <div className="flex-grow">
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase mb-1">Yapay Zeka Son İşlem Analizi</h3>
                {sonIslemDetay
                  ? <p className="text-gray-600 dark:text-gray-400 text-sm" dangerouslySetInnerHTML={{ __html: sonIslemDetay }} />
                  : <p className="text-gray-600 dark:text-gray-400 text-sm">Sistem hazır ve beklemede. Lütfen ilk işleminizi girin veya bakiyelerinizi tanımlayın.</p>
                }
              </div>
            </div>

            <BalanceTable bakiyeler={bakiyeler} />
            <TransactionLog loglar={loglar} islemSil={islemSil} islemDuzenle={islemDuzenle} />
          </div>
        </div>
      </main>

      <Footer bakiyeler={bakiyeler} loglar={loglar} verileriSifirla={verileriSifirla} />

      {showKurulumModal && (
        <QuickSetupModal
          onClose={() => setShowKurulumModal(false)}
          modalBanka={modalBanka} setModalBanka={setModalBanka}
          modalKredi={modalKredi} setModalKredi={setModalKredi}
          modalTutar={modalTutar} setModalTutar={setModalTutar}
          hizliHesapEkle={hizliHesapEkle}
        />
      )}

      {showDurumModal && (
        <FinancialStatusModal
          onClose={() => setShowDurumModal(false)}
          bakiyeler={bakiyeler}
          loglar={loglar}
          kmhFaizOrani={kmhFaizOrani}
          setKmhFaizOrani={setKmhFaizOrani}
        />
      )}

      {dialog && (
        <CustomDialog dialog={dialog} onClose={() => setDialog(null)} />
      )}
    </div>
  );
}
