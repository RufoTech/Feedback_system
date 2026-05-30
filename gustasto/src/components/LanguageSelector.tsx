import { useState, useRef, useEffect } from "react";

const getInitialLanguage = (): string => {
  const saved = localStorage.getItem("lang");
  if (saved) return saved;

  const browserLang = navigator.language || (navigator.languages && navigator.languages[0]) || "";
  const cleanLang = browserLang.toLowerCase();

  if (cleanLang.startsWith("az")) {
    return "AZ";
  } else if (cleanLang.startsWith("ru")) {
    return "RU";
  } else {
    return "ENG";
  }
};

export default function LanguageSelector() {
  const [lang, setLang] = useState(getInitialLanguage);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = ["AZ", "ENG", "RU"];

  const changeLang = (l: string) => {
    setLang(l);
    localStorage.setItem("lang", l);
    setIsOpen(false);
    window.dispatchEvent(new Event("languageChange"));
  };

  useEffect(() => {
    const handleLangChange = () => {
      setLang(getInitialLanguage());
    };
    window.addEventListener("languageChange", handleLangChange);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("languageChange", handleLangChange);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 bg-surface-container-low px-3 py-1.5 rounded-full border border-outline-variant/40 text-label-sm font-bold text-on-surface hover:bg-surface-container-high transition-colors focus:outline-none"
      >
        <span>{lang}</span>
        <span className="material-symbols-outlined text-[16px] transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          keyboard_arrow_down
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-24 bg-surface-container-lowest border border-outline-variant/50 rounded-lg shadow-lg py-1 z-50">
          {languages.map((l) => (
            <button
              key={l}
              onClick={() => changeLang(l)}
              className={`w-full text-left px-4 py-2 text-label-sm font-medium transition-colors hover:bg-surface-container-low ${
                lang === l ? "text-primary font-bold bg-primary/5" : "text-on-surface-variant"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
