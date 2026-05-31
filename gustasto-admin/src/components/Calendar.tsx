import React, { useState, useRef, useEffect } from 'react';

const AZ_MONTHS = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun',
  'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
];

const AZ_WEEKDAYS = ['B.e', 'Ç.a', 'C.a', 'C.i', 'C.b', 'Ş', 'B'];

interface CalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const containerRef = useRef<HTMLDivElement>(null);

  // Başqa yerə kliklədikdə bağla
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Ayın günləri
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  // Ayın ilk günü (0=Bazar, 1-B.e ...)
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  // Boş xanalar (ayın başlamazdan əvvəlki günlər)
  const emptySlots = firstDay === 0 ? 6 : firstDay - 1; // Həftəni B.e-dən başlayırıq

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(viewYear, viewMonth, day);
    onDateSelect?.(clickedDate);
    setIsOpen(false);
  };

  const isToday = (day: number) =>
    day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  const isSelected = (day: number) =>
    selectedDate &&
    day === selectedDate.getDate() &&
    viewMonth === selectedDate.getMonth() &&
    viewYear === selectedDate.getFullYear();

  const formatDate = (date: Date) =>
    `${date.getDate()} ${AZ_MONTHS[date.getMonth()]}`;

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center bg-surface-container rounded-full px-3 py-1.5 cursor-pointer hover:bg-surface-variant transition-colors border border-outline-variant/30"
      >
        <span className="material-symbols-outlined text-on-surface-variant text-sm mr-2">calendar_today</span>
        <span className="font-label-sm text-label-sm text-on-surface">
          {selectedDate ? formatDate(selectedDate) : `Bugün, ${formatDate(today)}`}
        </span>
        <span className="material-symbols-outlined text-on-surface-variant text-xs ml-1">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {/* Calendar Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-surface rounded-xl shadow-lg border border-outline-variant/30 z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Ay Başlığı + Naviqasiya */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-full hover:bg-surface-variant transition-colors"
            >
              <span className="material-symbols-outlined text-on-surface-variant text-lg">chevron_left</span>
            </button>
            <span className="font-label-md text-label-md text-on-surface font-semibold">
              {AZ_MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-full hover:bg-surface-variant transition-colors"
            >
              <span className="material-symbols-outlined text-on-surface-variant text-lg">chevron_right</span>
            </button>
          </div>

          {/* Həftə Günləri Başlığı */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {AZ_WEEKDAYS.map((day) => (
              <div key={day} className="text-center text-label-xs text-on-surface-variant font-medium py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Günlər Grid-i */}
          <div className="grid grid-cols-7 gap-1">
            {/* Boş xanalar */}
            {Array.from({ length: emptySlots }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* Günlər */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`w-full aspect-square flex items-center justify-center rounded-full text-body-sm transition-colors ${
                    isToday(day)
                      ? 'bg-primary text-on-primary font-bold'
                      : isSelected(day)
                      ? 'bg-primary-container text-on-primary-container font-semibold'
                      : 'text-on-surface hover:bg-surface-variant'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};