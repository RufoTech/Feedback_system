import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import LanguageSelector from "./LanguageSelector";
import SuccessPopup from "./SuccessPopup";
import { translations, type Language } from "../translations";
import type { RootState } from "../store/store";
import { useSubmitRequestMutation } from "../store/services/gustoApi";

export default function Feedback() {
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
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

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) return;

    const formData = new FormData();
    formData.append("restaurantId", session.restaurantId || "");
    formData.append("tableId", session.tableId || "");
    formData.append("tableNumber", session.tableNumber || "");
    formData.append("type", "complaint");
    formData.append("text", description);
    formData.append("isAnonymous", isAnonymous ? "true" : "false");
    
    if (!isAnonymous) {
      formData.append("customerName", name);
      formData.append("customerPhone", phone);
      formData.append("customerEmail", email);
    }

    if (photo) {
      formData.append("photo", photo);
    }

    try {
      await submitRequest(formData).unwrap();
      setDescription("");
      setPhoto(null);
      setPhotoPreview(null);
      setName("");
      setPhone("");
      setEmail("");
      setIsAnonymous(false);
      setShowSuccess(true);
    } catch (err: any) {
      console.error("=== XƏTA DETALLARI ===");
      console.error("Xəta obyekti:", err);
      console.error("Status:", err?.status);
      console.error("Data:", JSON.stringify(err?.data, null, 2));
      console.error("Message:", err?.data?.message || err?.message);
      console.error("Error:", err?.error);
      console.error("=== XƏTA SONU ===");
      alert("Xəta baş verdi, zəhmət olmasa yenidən cəhd edin.");
    }
  }

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col relative pb-8">
      {/* TopAppBar */}
      <header className="bg-surface/90 backdrop-blur-md sticky top-0 shadow-sm flex justify-between items-center w-full px-container-margin py-base z-50 relative">
        <Link to="/" className="flex items-center justify-center p-2 rounded-full text-on-surface-variant hover:text-primary transition-colors focus:outline-none">
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </Link>
        <div className="text-center absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          {session.logo ? (
            <img
              src={session.logo}
              alt={session.restaurantName || "Gusto"}
              className="max-h-14 w-auto object-contain"
            />
          ) : (
            <span className="text-headline-lg-mobile font-headline-lg-mobile font-bold text-primary tracking-tight">
              {session.restaurantName || "Gusto"}
            </span>
          )}
        </div>
        <LanguageSelector />
      </header>

      {/* Main Content */}
      <main className="flex-grow px-container-margin pt-stack-md pb-stack-lg max-w-2xl mx-auto w-full">
        <div className="mb-stack-md text-center">
          <h2 className="text-headline-md font-headline-md text-on-surface mb-2">
            {t.complaint}
          </h2>
          <p className="text-body-md font-body-md text-on-surface-variant">
            {t.feedbackShare}
          </p>
        </div>

        <form
          className="space-y-stack-md bg-surface-container-lowest rounded-xl p-6 ambient-shadow"
          onSubmit={handleSubmit}
        >

          {/* Description Textarea */}
          <div className="flex flex-col space-y-1">
            <label
              className="text-label-md font-label-md text-on-surface-variant"
              htmlFor="description"
            >
              {t.descriptionLabel}
            </label>
            <textarea
              id="description"
              className="w-full form-input-bottom-border text-body-md font-body-md text-on-surface py-3 resize-none focus:ring-0 focus:border-primary transition-colors shadow-inner rounded-t-sm"
              placeholder={t.descriptionPlaceholder}
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Photo Upload */}
          <div className="flex flex-col space-y-1">
            <span className="text-label-md font-label-md text-on-surface-variant">
              {t.uploadPhoto}
            </span>
            <label
              className="border border-dashed border-outline-variant rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-surface-container-low transition-colors bg-background"
              htmlFor="photo-upload"
            >
              {photoPreview ? (
                <div className="relative group">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="max-h-40 rounded-lg object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                    <span className="material-symbols-outlined text-white text-2xl">change_circle</span>
                  </div>
                </div>
              ) : (
                <>
                  <span className="material-symbols-outlined text-tertiary mb-2 text-3xl">
                    add_a_photo
                  </span>
                  <span className="text-body-md font-body-md text-tertiary text-center">
                    {t.dragDrop}
                  </span>
                </>
              )}
              <input
                accept="image/*"
                className="hidden"
                id="photo-upload"
                type="file"
                onChange={handlePhotoChange}
                disabled={isSubmitting}
              />
            </label>
          </div>

          <hr className="border-t border-outline-variant/50 my-stack-md" />

          {/* Anonymous Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-body-md font-body-md text-on-surface font-medium">
                {t.sendAnonymously}
              </h3>
              <p className="text-label-sm font-label-sm text-on-surface-variant">
                {t.confidentialInfo}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                className="sr-only peer"
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                disabled={isSubmitting}
              />
              <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {/* Optional Personal Info */}
          {!isAnonymous && (
            <div className="space-y-stack-md transition-all duration-300">
              <div className="flex flex-col space-y-1">
                <label
                  className="text-label-md font-label-md text-on-surface-variant"
                  htmlFor="name"
                >
                  {t.yourName}
                </label>
                <input
                  id="name"
                  className="w-full form-input-bottom-border text-body-md font-body-md text-on-surface py-3 focus:ring-0 focus:border-primary transition-colors"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isAnonymous}
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label
                  className="text-label-md font-label-md text-on-surface-variant"
                  htmlFor="phone"
                >
                  {t.phone}
                </label>
                <input
                  id="phone"
                  className="w-full form-input-bottom-border text-body-md font-body-md text-on-surface py-3 focus:ring-0 focus:border-primary transition-colors"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required={!isAnonymous}
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label
                  className="text-label-md font-label-md text-on-surface-variant"
                  htmlFor="email"
                >
                  {t.email}
                </label>
                <input
                  id="email"
                  className="w-full form-input-bottom-border text-body-md font-body-md text-on-surface py-3 focus:ring-0 focus:border-primary transition-colors"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            className="w-full bg-primary text-on-primary h-[56px] rounded-lg text-body-lg font-body-lg font-medium flex items-center justify-center interactive-shadow hover:opacity-90 active:scale-[0.98] transition-all mt-stack-lg disabled:opacity-50"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span
                className="material-symbols-outlined animate-spin"
                style={{ fontVariationSettings: "'FILL' 0" }}
              >
                progress_activity
              </span>
            ) : (
              <span>{t.send}</span>
            )}
          </button>
        </form>
      </main>
      <SuccessPopup
        show={showSuccess}
        onClose={() => setShowSuccess(false)}
        title={t.thankYouTitle}
        message={t.sentAlert}
        buttonText={t.closeButton}
      />
    </div>
  );
}
