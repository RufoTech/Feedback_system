import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useGetRequestsQuery } from '../store/services/adminApi';
import type { RequestSubmission } from '../store/services/adminApi';
import { FaConciergeBell, FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { ModalPortal } from '../components/ModalPortal';

// Nisbi vaxtı hesablamaq üçün Azərbaycan dilində sadə funksiya
const getRelativeTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'İndi';
  if (diffMins < 60) return `${diffMins} dəq əvvəl`;
  if (diffHours < 24) return `${diffHours} saat əvvəl`;
  return `${diffDays} gün əvvəl`;
};

export const DashboardHome: React.FC = () => {
  const { selectedBranchId } = useOutletContext<{ selectedBranchId: string }>();
  const [activeFilter, setActiveFilter] = useState<'all' | 'suggestion' | 'complaint' | 'review'>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<RequestSubmission | null>(null);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showMobileExportModal, setShowMobileExportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const exportDropdownRef = useRef<HTMLDivElement>(null);

  // Modal açıq olduqda body-ə class əlavə et (bottom nav-i gizlətmək üçün)
  const anyModalOpen = selectedRequest !== null || selectedPhoto !== null || showMobileExportModal;
  useEffect(() => {
    if (anyModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [anyModalOpen]);

  // Başqa yerə kliklədikdə export dropdown-u bağla
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target as Node)) {
        setShowExportDropdown(false);
      }
    };
    if (showExportDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showExportDropdown]);

  // RTK Query müraciətləri çəkir, real vaxtda olması üçün hər 4 saniyədən bir yeniləyir (polling)
  const { data: requests = [], isLoading, error } = useGetRequestsQuery(
    { type: activeFilter, branchId: selectedBranchId },
    { pollingInterval: 4000 }
  );

  // Excel export funksiyası
  const handleExport = async (period: 'daily' | 'monthly' | '6monthly' | 'yearly') => {
    setShowExportDropdown(false);
    setIsExporting(true);

    try {
      const now = new Date();
      let startDate: Date;

      switch (period) {
        case 'daily':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'monthly':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case '6monthly':
          startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
          break;
        case 'yearly':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
      }

      const token = localStorage.getItem('admin_token');
      const params = new URLSearchParams();
      if (activeFilter && activeFilter !== 'all') params.set('type', activeFilter);
      if (selectedBranchId) params.set('branchId', selectedBranchId);
      params.set('startDate', startDate.toISOString());

      const response = await fetch(`http://localhost:3000/api/requests?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Server xətası: ${response.status}`);
      }

      const exportRequests: RequestSubmission[] = await response.json();

      if (exportRequests.length === 0) {
        alert('Bu dövr üçün heç bir müraciət tapılmadı.');
        return;
      }

      // Məlumatları cədvəl strukturuna çevir
      const data = exportRequests.map(req => ({
        'Masa': req.tableNumber,
        'Kateqoriya': req.type === 'complaint' ? 'Şikayət' : req.type === 'suggestion' ? 'Təklif' : 'Rəy',
        'Müraciət Mətni': req.text,
        'Anonim': req.isAnonymous ? 'Bəli' : 'Xeyr',
        'Ad Soyad': req.isAnonymous ? '' : (req.customerName || ''),
        'Əlaqə Nömrəsi': req.isAnonymous ? '' : (req.customerPhone || ''),
        'E-poçt': req.isAnonymous ? '' : (req.customerEmail || ''),
        'Tarix / Vaxt': new Date(req.createdAt).toLocaleString('az-AZ'),
      }));

      // XLSX yarat və yüklə
      const ws = XLSX.utils.json_to_sheet(data);

      // Sütun genişliklərini avtomatik hesabla
      const colWidths = Object.keys(data[0]).map(key => ({
        wch: Math.max(key.length + 4, ...data.map(row => String(row[key as keyof typeof row] || '').length + 2)),
      }));
      ws['!cols'] = colWidths;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Hesabat');

      const periodLabels: Record<string, string> = {
        daily: 'Günlük',
        monthly: 'Aylıq',
        '6monthly': '6_Aylıq',
        yearly: 'İllik',
      };
      const dateStr = now.toISOString().split('T')[0];
      XLSX.writeFile(wb, `Gusto_Hesabat_${periodLabels[period]}_${dateStr}.xlsx`);
    } catch (err: any) {
      console.error('Export xətası:', err);
      alert(`Export zamanı xəta baş verdi: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8 pb-24 md:pb-8">
      {/* Filters & Actions Row */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full font-label-md text-label-md border transition-all ${
              activeFilter === 'all'
                ? 'bg-primary-container text-on-primary-container border-primary-container font-semibold'
                : 'bg-surface text-on-surface border-outline-variant/50 hover:bg-surface-variant'
            }`}
          >
            Hamısı
          </button>
          <button
            onClick={() => setActiveFilter('review')}
            className={`px-4 py-2 rounded-full font-label-md text-label-md border transition-all ${
              activeFilter === 'review'
                ? 'bg-primary-container text-on-primary-container border-primary-container font-semibold'
                : 'bg-surface text-on-surface border-outline-variant/50 hover:bg-surface-variant'
            }`}
          >
            Rəylər (Rating)
          </button>
          <button
            onClick={() => setActiveFilter('suggestion')}
            className={`px-4 py-2 rounded-full font-label-md text-label-md border transition-all ${
              activeFilter === 'suggestion'
                ? 'bg-primary-container text-on-primary-container border-primary-container font-semibold'
                : 'bg-surface text-on-surface border-outline-variant/50 hover:bg-surface-variant'
            }`}
          >
            Təkliflər
          </button>
          <button
            onClick={() => setActiveFilter('complaint')}
            className={`px-4 py-2 rounded-full font-label-md text-label-md border transition-all ${
              activeFilter === 'complaint'
                ? 'bg-primary-container text-on-primary-container border-primary-container font-semibold'
                : 'bg-surface text-on-surface border-outline-variant/50 hover:bg-surface-variant'
            }`}
          >
            Şikayətlər
          </button>
        </div>

        {/* Export Report — Mobile (opens modal) */}
        <div className="md:hidden">
          <button
            onClick={() => setShowMobileExportModal(true)}
            disabled={isExporting}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-label-md text-label-md border transition-all bg-surface text-on-surface border-outline-variant/50 hover:bg-surface-variant ${isExporting ? 'opacity-60 cursor-wait' : ''}`}
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                <span>Export edilir...</span>
              </>
            ) : (
              <>
                <FaFileExcel className="text-green-600 text-base" />
                <span>Hesabat</span>
              </>
            )}
          </button>
        </div>

        {/* Export Report Dropdown — Desktop */}
        <div className="relative hidden md:block" ref={exportDropdownRef}>
          <button
            onClick={() => setShowExportDropdown(prev => !prev)}
            disabled={isExporting}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-label-md text-label-md border transition-all ${
              showExportDropdown
                ? 'bg-primary-container text-on-primary-container border-primary font-semibold'
                : 'bg-surface text-on-surface border-outline-variant/50 hover:bg-surface-variant'
            } ${isExporting ? 'opacity-60 cursor-wait' : ''}`}
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                <span>Export edilir...</span>
              </>
            ) : (
              <>
                <FaFileExcel className="text-green-600 text-base" />
                <span>Hesabat</span>
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </>
            )}
          </button>

          {showExportDropdown && (
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-52 bg-surface rounded-xl shadow-lg border border-outline-variant/30 z-40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <button
                onClick={() => handleExport('daily')}
                className="w-full text-left px-4 py-3 hover:bg-surface-variant transition-colors flex items-center gap-3 border-b border-outline-variant/10"
              >
                <span className="material-symbols-outlined text-primary text-lg">today</span>
                <div>
                  <p className="font-body-md text-body-md text-on-surface font-medium">Günlük</p>
                  <p className="text-label-sm text-on-surface-variant">Bu günün hesabatı</p>
                </div>
              </button>
              <button
                onClick={() => handleExport('monthly')}
                className="w-full text-left px-4 py-3 hover:bg-surface-variant transition-colors flex items-center gap-3 border-b border-outline-variant/10"
              >
                <span className="material-symbols-outlined text-primary text-lg">calendar_month</span>
                <div>
                  <p className="font-body-md text-body-md text-on-surface font-medium">Aylıq</p>
                  <p className="text-label-sm text-on-surface-variant">Bu ayın hesabatı</p>
                </div>
              </button>
              <button
                onClick={() => handleExport('6monthly')}
                className="w-full text-left px-4 py-3 hover:bg-surface-variant transition-colors flex items-center gap-3 border-b border-outline-variant/10"
              >
                <span className="material-symbols-outlined text-primary text-lg">date_range</span>
                <div>
                  <p className="font-body-md text-body-md text-on-surface font-medium">6 Aylıq</p>
                  <p className="text-label-sm text-on-surface-variant">Son 6 ayın hesabatı</p>
                </div>
              </button>
              <button
                onClick={() => handleExport('yearly')}
                className="w-full text-left px-4 py-3 hover:bg-surface-variant transition-colors flex items-center gap-3"
              >
                <span className="material-symbols-outlined text-primary text-lg">event</span>
                <div>
                  <p className="font-body-md text-body-md text-on-surface font-medium">İllik</p>
                  <p className="text-label-sm text-on-surface-variant">Bu ilin hesabatı</p>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Requests Grid / Table */}
      <div className="bg-surface rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/20 overflow-hidden">
        {/* Table Header (Desktop) */}
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-outline-variant/30 bg-surface-container/30">
          <div className="col-span-3 font-label-sm text-label-sm text-on-surface-variant font-bold">Masa / Qonaq</div>
          <div className="col-span-2 font-label-sm text-label-sm text-on-surface-variant font-bold">Kateqoriya</div>
          <div className="col-span-5 font-label-sm text-label-sm text-on-surface-variant font-bold">Müraciət Mətni</div>
          <div className="col-span-2 font-label-sm text-label-sm text-on-surface-variant font-bold">Tarix / Vaxt</div>
        </div>

        {/* Table Rows */}
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-on-surface-variant font-medium text-body-md animate-pulse">Sorğular yüklənir...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-error">
            <span className="material-symbols-outlined text-4xl mb-2">error</span>
            <p className="font-semibold text-body-md">Müraciətlər yüklənərkən xəta baş verdi</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center text-on-surface-variant">
            <FaConciergeBell className="text-4xl mb-2 text-primary/30" />
            <p className="font-semibold text-body-md">Müraciət tapılmadı</p>
          </div>
        ) : (
          <div className="space-y-2 p-2">
            {requests.map((req) => {
              // Kateqoriyaya görə xüsusi rənglər və ikonlar
              let catBadge = '';
              let catIcon = '';
              let borderClass = 'border-transparent';

              if (req.type === 'complaint') {
                catBadge = 'bg-error-container text-on-error-container';
                catIcon = 'priority_high';
                borderClass = 'border-error bg-error-container/5';
              } else if (req.type === 'suggestion') {
                catBadge = 'bg-secondary-container text-on-secondary-container';
                catIcon = 'lightbulb';
                borderClass = 'border-amber-500 bg-amber-500/5';
              } else {
                catBadge = 'bg-tertiary-container text-on-tertiary-container';
                catIcon = 'star';
                borderClass = 'border-primary bg-primary/5';
              }

              return (
                <div
                  key={req._id}
                  onClick={() => setSelectedRequest(req)}
                  className={`grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center bg-surface hover:bg-surface-container/30 transition-all border-l-4 cursor-pointer rounded-xl shadow-[0px_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0px_4px_20px_rgba(0,0,0,0.1)] active:scale-[0.99] ${borderClass}`}
                >
                  {/* Table / Guest */}
                  <div className="col-span-1 md:col-span-3 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center font-bold text-on-surface shrink-0">
                      {req.tableNumber}
                    </div>
                    <div className="ml-3 overflow-hidden">
                      <p className="font-body-md text-body-md font-bold text-on-surface">Masa {req.tableNumber}</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant truncate">
                        {req.isAnonymous ? 'Anonim' : req.customerName}
                      </p>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="col-span-1 md:col-span-2">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${catBadge}`}>
                      <span className="material-symbols-outlined text-[14px] mr-1">{catIcon}</span>
                      {req.type === 'complaint' ? 'Şikayət' : req.type === 'suggestion' ? 'Təklif' : 'Rəy'}
                    </span>
                  </div>

                  {/* Submission Text */}
                  <div className="col-span-1 md:col-span-5 flex flex-col gap-2">
                    {req.type === 'review' && req.rating > 0 && (
                      <div className="flex text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`material-symbols-outlined text-sm ${
                              i < req.rating ? 'icon-fill' : 'opacity-30'
                            }`}
                          >
                            star
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="font-body-md text-body-md text-on-surface leading-relaxed italic">
                      "{req.text}"
                    </p>
                    {!req.isAnonymous && req.customerPhone && (
                      <p className="text-[11px] text-primary font-medium">
                        📞 Əlaqə: {req.customerPhone}
                      </p>
                    )}
                    {/* Şəkil əlavə edilibsə thumbnail */}
                    {req.photoUrl && (
                      <div className="mt-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPhoto(req.photoUrl || null);
                          }}
                          className="flex items-center gap-1.5 p-1 bg-surface-container rounded-lg border border-outline-variant hover:bg-surface-variant transition-colors"
                        >
                          <img
                            src={req.photoUrl}
                            alt="Şikayət şəkli"
                            className="w-10 h-10 object-cover rounded-md"
                          />
                          <span className="text-[11px] font-bold text-on-surface-variant pr-2">Şəkli böyüt</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Date / Time */}
                  <div className="col-span-1 md:col-span-2 flex md:block items-center justify-between mt-2 md:mt-0">
                    <span className="md:hidden font-label-sm text-label-sm text-on-surface-variant font-bold">Vaxt:</span>
                    <div>
                      <p className="font-body-md text-body-md text-primary font-semibold">
                        {getRelativeTime(req.createdAt)}
                      </p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">
                        {new Date(req.createdAt).toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Premium Details Modal Overlay */}
      {selectedRequest && (
        <ModalPortal>
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl p-6 max-w-lg w-full relative flex flex-col gap-5 shadow-2xl border border-outline-variant/30 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedRequest(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-surface-variant/40 hover:bg-surface-variant/80 text-on-surface rounded-full flex items-center justify-center transition-colors focus:outline-none"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${
                selectedRequest.type === 'complaint' 
                  ? 'bg-error-container text-on-error-container' 
                  : selectedRequest.type === 'suggestion' 
                    ? 'bg-secondary-container text-on-secondary-container' 
                    : 'bg-tertiary-container text-on-tertiary-container'
              }`}>
                <span className="material-symbols-outlined">
                  {selectedRequest.type === 'complaint' ? 'priority_high' : selectedRequest.type === 'suggestion' ? 'lightbulb' : 'star'}
                </span>
              </span>
              <div>
                <h3 className="text-title-lg font-bold text-on-surface">
                  {selectedRequest.type === 'complaint' ? 'Şikayət' : selectedRequest.type === 'suggestion' ? 'Təklif' : 'Rəy'}
                </h3>
                <p className="text-label-sm text-on-surface-variant">Masa {selectedRequest.tableNumber}</p>
              </div>
            </div>

            <div className="border-t border-b border-outline-variant/30 py-4 my-1">
              <p className="text-body-lg text-on-surface leading-relaxed italic font-medium">
                "{selectedRequest.text}"
              </p>
              
              {selectedRequest.type === 'review' && selectedRequest.rating > 0 && (
                <div className="flex text-amber-500 mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`material-symbols-outlined text-lg ${
                        i < selectedRequest.rating ? 'icon-fill' : 'opacity-30'
                      }`}
                    >
                      star
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Göndərən Məlumatları</h4>
              {selectedRequest.isAnonymous ? (
                <div className="bg-surface-variant/30 rounded-xl p-4 border border-outline-variant/20 flex items-center gap-2.5 text-on-surface-variant">
                  <span className="material-symbols-outlined text-amber-600">visibility_off</span>
                  <span className="font-semibold text-body-md">Mesaj anonimdir</span>
                </div>
              ) : (
                <div className="bg-surface-variant/20 rounded-xl p-4 border border-outline-variant/20 space-y-2">
                  <p className="text-body-md text-on-surface">
                    <span className="font-bold text-on-surface-variant">Ad Soyad: </span>
                    {selectedRequest.customerName || 'Qeyd edilməyib'}
                  </p>
                  <p className="text-body-md text-on-surface">
                    <span className="font-bold text-on-surface-variant">Telefon: </span>
                    {selectedRequest.customerPhone || 'Qeyd edilməyib'}
                  </p>
                  <p className="text-body-md text-on-surface">
                    <span className="font-bold text-on-surface-variant">E-poçt: </span>
                    {selectedRequest.customerEmail || 'Qeyd edilməyib'}
                  </p>
                </div>
              )}
            </div>

            {selectedRequest.photoUrl && (
              <div className="mt-1 flex flex-col gap-2">
                <span className="text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Əlavə edilən şəkil</span>
                <div className="relative group max-w-[200px] cursor-pointer" onClick={() => setSelectedPhoto(selectedRequest.photoUrl || null)}>
                  <img
                    src={selectedRequest.photoUrl}
                    alt="Müraciət şəkli"
                    className="w-full h-24 object-cover rounded-lg border border-outline-variant hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                    <span className="material-symbols-outlined text-white text-lg">zoom_in</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-label-sm text-on-surface-variant mt-2">
              <span>{new Date(selectedRequest.createdAt).toLocaleString('az-AZ')}</span>
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-5 py-2 bg-primary text-on-primary font-bold rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-sm"
              >
                Bağla
              </button>
            </div>
          </div>
        </div>
        </ModalPortal>
      )}

      {/* Premium Photo Modal Overlay */}
      {selectedPhoto && (
        <ModalPortal>
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-4 max-w-2xl w-full relative flex flex-col items-center shadow-2xl border border-outline-variant/30">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-black/10 hover:bg-black/20 text-on-surface rounded-full flex items-center justify-center transition-colors focus:outline-none"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="text-title-lg font-bold text-on-surface mb-4">Şikayətə Əlavə Edilmiş Şəkil</h3>
            <img
              src={selectedPhoto}
              alt="Şikayət Böyük Şəkil"
              className="max-h-[70vh] rounded-xl object-contain max-w-full"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="mt-4 px-6 py-2 bg-primary text-on-primary font-bold rounded-lg hover:opacity-90 active:scale-95 transition-all"
            >
              Bağla
            </button>
          </div>
        </div>
        </ModalPortal>
      )}

      {/* Mobile Export Report Modal */}
      {showMobileExportModal && (
        <ModalPortal>
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] p-5 md:hidden">
          <div className="bg-surface w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-outline-variant/30 animate-in fade-in zoom-in-95 duration-200 max-h-[80vh] flex flex-col absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <FaFileExcel className="text-green-600 text-lg" />
                </div>
                <div>
                  <h3 className="text-title-lg font-bold text-on-surface">Hesabat</h3>
                  <p className="text-label-sm text-on-surface-variant">Excel faylı yüklə</p>
                </div>
              </div>
              <button
                onClick={() => setShowMobileExportModal(false)}
                className="w-10 h-10 bg-surface-variant/40 hover:bg-surface-variant/80 text-on-surface rounded-full flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto">
              <button
                onClick={() => { handleExport('daily'); setShowMobileExportModal(false); }}
                disabled={isExporting}
                className="w-full text-left px-5 py-4 bg-surface-container/50 hover:bg-surface-variant rounded-2xl transition-colors flex items-center gap-4 active:scale-[0.98]"
              >
                <span className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-xl">today</span>
                </span>
                <div>
                  <p className="font-body-lg text-body-lg text-on-surface font-semibold">Günlük</p>
                  <p className="text-label-sm text-on-surface-variant">Bu günün hesabatı</p>
                </div>
              </button>

              <button
                onClick={() => { handleExport('monthly'); setShowMobileExportModal(false); }}
                disabled={isExporting}
                className="w-full text-left px-5 py-4 bg-surface-container/50 hover:bg-surface-variant rounded-2xl transition-colors flex items-center gap-4 active:scale-[0.98]"
              >
                <span className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-xl">calendar_month</span>
                </span>
                <div>
                  <p className="font-body-lg text-body-lg text-on-surface font-semibold">Aylıq</p>
                  <p className="text-label-sm text-on-surface-variant">Bu ayın hesabatı</p>
                </div>
              </button>

              <button
                onClick={() => { handleExport('6monthly'); setShowMobileExportModal(false); }}
                disabled={isExporting}
                className="w-full text-left px-5 py-4 bg-surface-container/50 hover:bg-surface-variant rounded-2xl transition-colors flex items-center gap-4 active:scale-[0.98]"
              >
                <span className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-xl">date_range</span>
                </span>
                <div>
                  <p className="font-body-lg text-body-lg text-on-surface font-semibold">6 Aylıq</p>
                  <p className="text-label-sm text-on-surface-variant">Son 6 ayın hesabatı</p>
                </div>
              </button>

              <button
                onClick={() => { handleExport('yearly'); setShowMobileExportModal(false); }}
                disabled={isExporting}
                className="w-full text-left px-5 py-4 bg-surface-container/50 hover:bg-surface-variant rounded-2xl transition-colors flex items-center gap-4 active:scale-[0.98]"
              >
                <span className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-xl">event</span>
                </span>
                <div>
                  <p className="font-body-lg text-body-lg text-on-surface font-semibold">İllik</p>
                  <p className="text-label-sm text-on-surface-variant">Bu ilin hesabatı</p>
                </div>
              </button>
            </div>
          </div>
        </div>
        </ModalPortal>
      )}
    </div>
  );
};
