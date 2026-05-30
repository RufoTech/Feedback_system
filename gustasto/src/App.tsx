import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Homescreen from "./components/Homescreen";
import Feedback from "./components/Feedback";
import Suggestion from "./components/Suggestion";
import { setSession } from "./store/slices/sessionSlice";
import type { RootState } from "./store/store";
import { useGetTableQuery } from "./store/services/gustoApi";

// Bu köməkçi komponent URL-dəki QR parametrlərini yoxlayır və Redux-a yazır
function SessionManager({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const session = useSelector((state: RootState) => state.session);
  const [activeTableId, setActiveTableId] = useState<string | null>(null);

  const queryRestaurantId = searchParams.get("restaurantId");
  const queryTableId = searchParams.get("tableId");

  // URL-dən gələn tableId-ni çəkmək üçün activeTableId təyin edirik
  useEffect(() => {
    if (queryTableId && queryRestaurantId) {
      setActiveTableId(queryTableId);
    }
  }, [queryTableId, queryRestaurantId]);

  // RTK Query ilə Masa və Restoran məlumatlarını çəkirik
  const { data: tableData, error, isLoading } = useGetTableQuery(activeTableId || "", {
    skip: !activeTableId,
  });

  useEffect(() => {
    if (tableData) {
      // Məlumatlar uğurla çəkildikdə session-a yazırıq
      dispatch(
        setSession({
          restaurantId: tableData.restaurant.id,
          tableId: tableData.id,
          tableNumber: tableData.tableNumber,
          restaurantName: tableData.restaurant.name,
          logo: tableData.restaurant.logo,
          address: tableData.restaurant.address,
        })
      );
      // URL-i təmizləyirik (query string silinir)
      setSearchParams({}, { replace: true });
      setActiveTableId(null);
    }
  }, [tableData, dispatch, setSearchParams]);

  // Əgər URL-dən parametr gəlibsə və yüklənirsə, premium spinner göstərək
  if (activeTableId && isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-primary/10 animate-pulse"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
        </div>
        <h3 className="text-headline-sm font-bold text-on-surface mb-2">Restoran Məlumatları Oxunur</h3>
        <p className="text-body-md text-on-surface-variant max-w-xs">Masa və restoran təyin edilir, zəhmət olmasa gözləyin...</p>
      </div>
    );
  }

  // Əgər Masa tapılmadısa və ya error baş veribsə
  if (activeTableId && error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center text-error mb-4">
          <span className="material-symbols-outlined text-4xl">error</span>
        </div>
        <h3 className="text-headline-sm font-bold text-on-surface mb-2">Masa Təyin Edilə Bilmədi</h3>
        <p className="text-body-md text-on-surface-variant max-w-sm mb-6">
          Skan etdiyiniz QR kod etibarsızdır və ya masa bazadan silinib. Zəhmət olmasa yenidən cəhd edin.
        </p>
        <button
          onClick={() => {
            setActiveTableId(null);
            setSearchParams({}, { replace: true });
          }}
          className="bg-primary text-on-primary px-6 py-2.5 rounded-lg text-label-md font-bold hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Ana Səhifəyə Qayıt
        </button>
      </div>
    );
  }

  // Əgər heç bir aktiv masa yoxdursa və localStorage boşdursa (müştəri birbaşa girib)
  if (!session.restaurantId || !session.tableId) {
    return <ScanQRCodePrompt />;
  }

  return <>{children}</>;
}

// QR Kod skan etməyə təşviq edən premium ekran
function ScanQRCodePrompt() {
  const dispatch = useDispatch();

  // Test masası ilə daxil olmaq üçün funksiya (yoxlamağı asanlaşdırır)
  const handleTestLogin = (tableNum: string, tableId: string, restId: string) => {
    dispatch(
      setSession({
        restaurantId: restId,
        tableId: tableId,
        tableNumber: tableNum,
        restaurantName: "Gusto Baku",
        logo: "https://lh3.googleusercontent.com/aida/ADBb0ugHZELWWzv84yZGC4tvvUpEAGiMy-hWwrEPimn76u12Bz8k4j5IvYSzkO_epoaF9FZwJFpK5K6zGodHshqZwZO82yBkH-NZGraLV0rfMizR7J-G1UkeeX-l3Qk0egZD3nJPmTxkNqnZdiRcAHmYfVYa9zJpM6qQbOdLYRPoTRTUS0hJt9g8-Et9S2JtD7777-_VMKU2nQLtdJxwLXibxta60PIdkzp7bVNfdKc4l2asTYMSn1O7iEwwfQPR",
        address: "Nizami küçəsi 42, Bakı, Azərbaycan",
      })
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-surface-container-low flex flex-col justify-between p-6 text-center select-none relative overflow-hidden">
      <div className="absolute top-1/4 -right-1/4 w-[350px] h-[350px] rounded-full bg-primary/5 blur-[80px] pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-[200px] h-[200px] rounded-full bg-primary-container/5 blur-[60px] pointer-events-none"></div>

      {/* Header */}
      <header className="flex justify-between items-center py-4">
        <div className="text-headline-lg font-bold text-primary tracking-tight mx-auto">Gusto</div>
      </header>

      {/* Central QR Code illustration & Prompt */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto my-auto gap-6 z-10">
        <div className="w-48 h-48 bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-6 shadow-xl relative group flex items-center justify-center">
          <span className="material-symbols-outlined text-[100px] text-primary/70 group-hover:text-primary transition-colors animate-pulse">
            qr_code_scanner
          </span>
        </div>

        <div>
          <h2 className="text-headline-md font-bold text-on-surface tracking-tight mb-2">QR Kodu Skan Edin</h2>
          <p className="text-body-md text-on-surface-variant leading-relaxed">
            Restoranda sifarişinizi vermək, rəy bildirmək və ya şikayət yazmaq üçün masanızın üzərindəki QR kodu telefonunuzla skan edin.
          </p>
        </div>

        {/* Test Masaları (Yoxlamağı və testi asanlaşdırmaq üçün test düymələri) */}
        <div className="w-full mt-4 p-4 border border-dashed border-outline-variant/50 rounded-2xl bg-surface-container-lowest">
          <p className="text-label-sm font-semibold text-primary uppercase tracking-wider mb-3">Yoxlamaq üçün masa seçin (Demo)</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleTestLogin("12", "65e9c0c8b2cf14a1a5b82ad3", "65e9c0c8b2cf14a1a5b82ad1")}
              className="py-2.5 px-3 bg-surface hover:bg-surface-variant border border-outline-variant rounded-xl text-label-md font-medium text-on-surface text-center transition-colors"
            >
              Terrace (Masa 12)
            </button>
            <button
              onClick={() => handleTestLogin("04", "65e9c0c8b2cf14a1a5b82ad2", "65e9c0c8b2cf14a1a5b82ad1")}
              className="py-2.5 px-3 bg-surface hover:bg-surface-variant border border-outline-variant rounded-xl text-label-md font-medium text-on-surface text-center transition-colors"
            >
              VIP (Masa 04)
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-label-sm text-on-surface-variant py-4">
        &copy; 2026 Gusto Kiosk. Bütün hüquqlar qorunur.
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <SessionManager>
        <Routes>
          <Route path="/" element={<Homescreen />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/suggestion" element={<Suggestion />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SessionManager>
    </BrowserRouter>
  );
}

export default App;
