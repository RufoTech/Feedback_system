import { useEffect } from "react";

interface SuccessPopupProps {
  show: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText: string;
  autoCloseMs?: number;
}

export default function SuccessPopup({ show, onClose, title, message, buttonText, autoCloseMs = 4000 }: SuccessPopupProps) {
  useEffect(() => {
    if (show && autoCloseMs > 0) {
      const timer = setTimeout(onClose, autoCloseMs);
      return () => clearTimeout(timer);
    }
  }, [show, autoCloseMs, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 popup-overlay">
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-8 max-w-sm w-full flex flex-col items-center text-center shadow-2xl popup-card">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-5 popup-icon">
          <span className="material-symbols-outlined text-primary text-[44px] icon-fill">
            check_circle
          </span>
        </div>
        <h3 className="text-title-lg font-title-lg text-on-surface mb-2 popup-title">
          {title}
        </h3>
        <p className="text-body-md font-body-md text-on-surface-variant mb-6 popup-desc">
          {message}
        </p>
        <button
          onClick={onClose}
          className="w-full bg-primary text-on-primary py-3 rounded-xl font-label-md font-bold transition-all active:scale-95 popup-btn"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
