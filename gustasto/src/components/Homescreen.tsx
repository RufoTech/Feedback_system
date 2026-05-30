import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import LanguageSelector from "./LanguageSelector";
import SuccessPopup from "./SuccessPopup";
import { translations, type Language } from "../translations";
import type { RootState } from "../store/store";
import { clearSession } from "../store/slices/sessionSlice";
import { useSubmitRequestMutation } from "../store/services/gustoApi";

export default function Homescreen() {
  const [rating, setRating] = useState(-1);
  const [lang, setLang] = useState<Language>(() => (localStorage.getItem("lang") as Language) || "AZ");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const session = useSelector((state: RootState) => state.session);
  const [submitRequest, { isLoading: isSubmittingRating }] = useSubmitRequestMutation();

  useEffect(() => {
    const handleLangChange = () => {
      setLang((localStorage.getItem("lang") as Language) || "AZ");
    };
    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  const t = translations[lang];

  const actions = [
    {
      icon: "lightbulb",
      title: t.suggestion,
      desc: t.suggestionDesc,
      color: "primary",
      target: "/suggestion",
      isRoute: true,
    },
    {
      icon: "error_outline",
      title: t.complaint,
      desc: t.complaintDesc,
      color: "error",
      target: "/feedback",
      isRoute: true,
    },
  ];

  const handleRatingSubmit = async () => {
    if (rating === -1) return;
    
    const ulduz = rating + 1; // 0-4 indeksini 1-5 ulduza çeviririk
    const formData = new FormData();
    formData.append("restaurantId", session.restaurantId || "");
    formData.append("tableId", session.tableId || "");
    formData.append("tableNumber", session.tableNumber || "");
    formData.append("type", "review");
    formData.append("text", `Müştəri restoranın ümumi keyfiyyətini ${ulduz} ulduz ilə qiymətləndirdi.`);
    formData.append("rating", ulduz.toString());
    formData.append("isAnonymous", "true");

    try {
      await submitRequest(formData).unwrap();
      setPopupMessage(t.ratingSentAlert);
      setShowPopup(true);
      setRating(-1);
    } catch (err) {
      console.error("Qiymətləndirmə göndərilərkən xəta baş verdi:", err);
      alert("Xəta baş verdi, zəhmət olmasa yenidən cəhd edin.");
    }
  };

  const handleResetSession = () => {
    if (window.confirm("Cari masadan çıxış etmək istədiyinizə əminsiniz? Yeni QR kod skan etməli olacaqsınız.")) {
      dispatch(clearSession());
      window.location.reload();
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col relative pb-8">
      {/* TopAppBar */}
      <header className="bg-surface/90 backdrop-blur-md sticky top-0 shadow-sm flex justify-between items-center w-full px-container-margin py-base z-50 relative">
        <button
          onClick={handleResetSession}
          className="flex items-center justify-center p-2 rounded-full text-on-surface-variant hover:text-error transition-colors focus:outline-none"
          title="Masadan Çıx"
        >
          <span className="material-symbols-outlined text-[22px]">logout</span>
        </button>
        <div className="text-center absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <span className="text-headline-lg-mobile font-headline-lg-mobile font-bold text-primary tracking-tight">
            {session.restaurantName || "Gusto"}
          </span>
          <span className="text-[11px] text-on-surface-variant font-medium uppercase tracking-wider -mt-1">
            Masa {session.tableNumber || ""}
          </span>
        </div>
        <LanguageSelector />
      </header>

      {/* Main Content */}
      <main className="flex-1 px-container-margin py-stack-md flex flex-col gap-stack-md w-full max-w-2xl mx-auto">
        {/* Actions Bento Grid */}
        <section className="flex flex-col gap-stack-sm">
          <h1 className="text-headline-md font-headline-md text-on-surface">{t.homeTitle}</h1>
          <p className="text-body-md font-body-md text-on-surface-variant mb-2">{t.homeDesc}</p>
          <div className="grid grid-cols-2 gap-gutter">
            {actions.map((action) => (
              <button
                key={action.target}
                onClick={() => {
                  if (action.isRoute) {
                    navigate(action.target);
                  }
                }}
                className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-5 flex flex-col items-start gap-3 shadow-[0px_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0px_6px_24px_rgba(0,0,0,0.06)] ambient-glow transition-all duration-300 text-left group focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors bg-surface-container-low ${
                    action.color === "error"
                      ? "group-hover:bg-error/10"
                      : "group-hover:bg-primary/10"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[28px] ${
                      action.color === "error" ? "text-error" : "text-primary"
                    }`}
                  >
                    {action.icon}
                  </span>
                </div>
                <div>
                  <h3 className="text-label-md font-label-md font-semibold text-on-surface">
                    {action.title}
                  </h3>
                  <p className="text-label-sm font-label-sm mt-1 text-on-surface-variant">
                    {action.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Mood / Quick Rating */}
        <section className="mt-stack-sm bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-outline-variant/40 flex flex-col items-center text-center gap-4 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
          <h2 className="text-title-lg font-title-lg text-on-surface z-10">{t.impression}</h2>
          <div className="flex items-center gap-2 z-10">
            {[0, 1, 2, 3, 4].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                disabled={isSubmittingRating}
                className="focus:outline-none hover:scale-110 transition-transform duration-200 group disabled:opacity-50"
              >
                <span
                  className={`material-symbols-outlined text-[36px] ${
                    star <= rating
                      ? "text-primary icon-fill"
                      : "text-primary/30 group-hover:text-primary"
                  }`}
                >
                  star
                </span>
              </button>
            ))}
          </div>
          <p className="text-label-sm font-label-sm text-on-surface-variant z-10">
            {t.rateTap}
          </p>
           {rating > -1 && (
            <button
              onClick={handleRatingSubmit}
              disabled={isSubmittingRating}
              className="mt-2 bg-primary text-on-primary px-6 py-2 rounded-lg text-label-md font-medium transition-all hover:opacity-90 active:scale-[0.98] z-10 flex items-center justify-center min-w-[100px] disabled:opacity-50"
            >
              {isSubmittingRating ? (
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
              ) : (
                t.send
              )}
            </button>
          )}
        </section>
      </main>

      <SuccessPopup
        show={showPopup}
        onClose={() => setShowPopup(false)}
        title={t.thankYouTitle}
        message={popupMessage}
        buttonText={t.closeButton}
      />
    </div>
  );
}
