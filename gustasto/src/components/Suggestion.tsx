import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import LanguageSelector from "./LanguageSelector";
import SuccessPopup from "./SuccessPopup";
import { translations, type Language } from "../translations";
import type { RootState } from "../store/store";
import { useSubmitRequestMutation } from "../store/services/gustoApi";

export default function Suggestion() {
  const [suggestionText, setSuggestionText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [lang, setLang] = useState<Language>(() => (localStorage.getItem("lang") as Language) || "AZ");

  const session = useSelector((state: RootState) => state.session);
  const [submitRequest, { isLoading: isSubmitting }] = useSubmitRequestMutation();

  useEffect(() => {
    const handleLangChange = () => {
      setLang((localStorage.getItem("lang") as Language) || "AZ");
    };
    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  const t = translations[lang];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!suggestionText.trim()) return;

    const formData = new FormData();
    formData.append("restaurantId", session.restaurantId || "");
    formData.append("tableId", session.tableId || "");
    formData.append("tableNumber", session.tableNumber || "");
    formData.append("type", "suggestion");
    formData.append("text", suggestionText);
    formData.append("isAnonymous", isAnonymous ? "true" : "false");
    
    if (!isAnonymous) {
      formData.append("customerName", name);
      formData.append("customerPhone", contact); // contact üçün də phone sahəsini istifadə edirik backend-də
    }

    try {
      await submitRequest(formData).unwrap();
      setSuggestionText("");
      setName("");
      setContact("");
      setIsAnonymous(false);
      setShowSuccess(true);
    } catch (err) {
      console.error("Təklif göndərilərkən xəta baş verdi:", err);
      alert("Xəta baş verdi, zəhmət olmasa yenidən cəhd edin.");
    }
  }

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col relative pb-8">
      {/* TopAppBar */}
      <header className="bg-surface/90 backdrop-blur-md sticky top-0 z-50 flex justify-between items-center w-full px-container-margin py-base shadow-sm relative">
        <Link to="/" className="flex items-center justify-center p-2 rounded-full text-on-surface-variant hover:text-primary transition-colors focus:outline-none">
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </Link>
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

      <main className="flex-grow px-container-margin pt-stack-md pb-stack-lg max-w-2xl mx-auto w-full">
        {/* Hero Title Section */}
        <div className="mb-stack-lg">
          <h1 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface mb-2">
            {t.suggestionsTitle}
          </h1>
          <p className="text-body-md font-body-md text-on-surface-variant max-w-[90%]">
            {t.suggestionsDesc}
          </p>
        </div>

        {/* Suggestion Form */}
        <form onSubmit={handleSubmit} className="space-y-stack-md">

          {/* Text Area */}
          <section className="glass-card p-6 rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/30 bg-surface-container-lowest/80 backdrop-blur-sm">
            <label
              className="block text-label-md font-label-md text-on-surface-variant mb-4"
              htmlFor="suggestion"
            >
              {t.yourSuggestion}
            </label>
            <textarea
              className="w-full bg-transparent border-none focus:ring-0 p-0 text-body-lg font-body-lg text-on-surface placeholder-outline-variant resize-none"
              id="suggestion"
              placeholder={`${t.yourSuggestion}...`}
              rows={6}
              value={suggestionText}
              onChange={(e) => setSuggestionText(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </section>

          {/* Anonymous Toggle */}
          <section className="flex items-center justify-between p-6 glass-card rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/30 bg-surface-container-lowest/80 backdrop-blur-sm">
            <div>
              <h4 className="text-title-lg font-title-lg text-on-surface">{t.sendAnonymously}</h4>
              <p className="text-label-sm font-label-sm text-on-surface-variant">
                {t.notSharedInfo}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                className="sr-only peer"
                id="anonymous-toggle"
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                disabled={isSubmitting}
              />
              <div className="w-11 h-6 bg-secondary-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
            </label>
          </section>

          {/* Personal Info Fields */}
          <section
            className="space-y-stack-sm transition-all duration-300"
            id="personal-info"
            style={{
              opacity: isAnonymous ? 0.3 : 1,
              pointerEvents: isAnonymous ? "none" : "auto",
              filter: isAnonymous ? "grayscale(100%)" : "none",
            }}
          >
            <div className="relative">
              <input
                className="w-full h-14 px-6 bg-surface-container-low border border-outline-variant rounded-xl text-body-md font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder={t.nameAndSurname}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isAnonymous}
                disabled={isSubmitting || isAnonymous}
              />
            </div>
            <div className="relative">
              <input
                className="w-full h-14 px-6 bg-surface-container-low border border-outline-variant rounded-xl text-body-md font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder={t.contactInfo}
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required={!isAnonymous}
                disabled={isSubmitting || isAnonymous}
              />
            </div>
          </section>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 bg-primary-container text-on-primary-container font-title-lg rounded-xl shadow-[0px_8px_30px_rgba(115,92,0,0.15)] active:scale-95 transition-transform mt-stack-lg flex items-center justify-center disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
            ) : (
              t.sendSuggestion
            )}
          </button>
        </form>
      </main>
      <SuccessPopup
        show={showSuccess}
        onClose={() => setShowSuccess(false)}
        title={t.thankYouTitle}
        message={t.suggestionSentAlert}
        buttonText={t.closeButton}
      />
    </div>
  );
}
