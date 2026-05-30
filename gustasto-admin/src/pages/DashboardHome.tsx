import React, { useState } from 'react';
import { useGetRequestsQuery, useUpdateRequestStatusMutation } from '../store/services/adminApi';

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
  const [activeFilter, setActiveFilter] = useState<'all' | 'suggestion' | 'complaint' | 'review'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // RTK Query müraciətləri çəkir, real vaxtda olması üçün hər 4 saniyədən bir yeniləyir (polling)
  const { data: requests = [], isLoading, error } = useGetRequestsQuery(
    { type: activeFilter },
    { pollingInterval: 4000 }
  );

  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateRequestStatusMutation();

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
    } catch (err) {
      console.error('Status yenilənərkən xəta baş verdi:', err);
    }
  };

  // Klient tərəfindən axtarış (Masa nömrəsinə və ya mətnə görə)
  const filteredRequests = requests.filter(req => {
    const tableMatches = req.tableNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const textMatches = req.text.toLowerCase().includes(searchTerm.toLowerCase());
    const nameMatches = req.customerName ? req.customerName.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    return tableMatches || textMatches || nameMatches;
  });

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

        {/* Client Search Bar */}
        <div className="relative w-full sm:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
          <input
            className="w-full pl-9 pr-4 py-2 bg-surface rounded-full border border-outline-variant/60 focus:ring-1 focus:ring-primary text-body-md font-body-md text-on-surface placeholder:text-on-surface-variant/60 transition-shadow"
            placeholder="Axtar (Masa, mətn)..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Requests Grid / Table */}
      <div className="bg-surface rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/20 overflow-hidden">
        {/* Table Header (Desktop) */}
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-outline-variant/30 bg-surface-container/30">
          <div className="col-span-2 font-label-sm text-label-sm text-on-surface-variant font-bold">Masa / Qonaq</div>
          <div className="col-span-2 font-label-sm text-label-sm text-on-surface-variant font-bold">Kateqoriya</div>
          <div className="col-span-4 font-label-sm text-label-sm text-on-surface-variant font-bold">Müraciət Mətni</div>
          <div className="col-span-2 font-label-sm text-label-sm text-on-surface-variant font-bold">Tarix / Vaxt</div>
          <div className="col-span-2 font-label-sm text-label-sm text-on-surface-variant font-bold text-right">Status / İdarəetmə</div>
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
        ) : filteredRequests.length === 0 ? (
          <div className="p-12 text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl mb-2 text-primary/30">concierge_bell</span>
            <p className="font-semibold text-body-md">Müraciət tapılmadı</p>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/20">
            {filteredRequests.map((req) => {
              // Kateqoriyaya görə xüsusi rənglər və ikonlar
              let catBadge = '';
              let catIcon = '';
              let borderClass = 'border-transparent';

              if (req.type === 'complaint') {
                catBadge = 'bg-error-container text-on-error-container';
                catIcon = 'priority_high';
                borderClass = req.status === 'pending' ? 'border-error bg-error-container/5' : 'border-error/40';
              } else if (req.type === 'suggestion') {
                catBadge = 'bg-secondary-container text-on-secondary-container';
                catIcon = 'lightbulb';
                borderClass = req.status === 'pending' ? 'border-amber-500 bg-amber-500/5' : 'border-amber-500/40';
              } else {
                catBadge = 'bg-tertiary-container text-on-tertiary-container';
                catIcon = 'star';
                borderClass = req.status === 'pending' ? 'border-primary bg-primary/5' : 'border-primary/40';
              }

              return (
                <div
                  key={req._id}
                  className={`grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center hover:bg-surface-container/30 transition-colors border-l-4 ${borderClass}`}
                >
                  {/* Table / Guest */}
                  <div className="col-span-1 md:col-span-2 flex items-center">
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
                  <div className="col-span-1 md:col-span-4 flex flex-col gap-2">
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
                          onClick={() => setSelectedPhoto(req.photoUrl || null)}
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

                  {/* Actions / Status */}
                  <div className="col-span-1 md:col-span-2 flex justify-end gap-2 mt-2 md:mt-0">
                    {req.status === 'pending' ? (
                      <button
                        onClick={() => handleStatusChange(req._id, 'in_progress')}
                        disabled={isUpdatingStatus}
                        className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-sm text-label-sm font-bold hover:opacity-90 active:scale-[0.98] transition-colors w-full md:w-auto shadow-sm"
                      >
                        Təsdiqlə
                      </button>
                    ) : req.status === 'in_progress' ? (
                      <button
                        onClick={() => handleStatusChange(req._id, 'completed')}
                        disabled={isUpdatingStatus}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-label-sm text-label-sm font-bold hover:bg-green-700 active:scale-[0.98] transition-colors w-full md:w-auto shadow-sm flex items-center justify-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">check</span>
                        Tamamla
                      </button>
                    ) : (
                      <span className="inline-flex items-center text-label-md font-label-md font-semibold text-green-600 px-3 py-1 bg-green-50 rounded-full border border-green-200">
                        <span className="material-symbols-outlined text-[16px] mr-1">check_circle</span>
                        Tamamlandı
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Premium Photo Modal Overlay */}
      {selectedPhoto && (
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
      )}
    </div>
  );
};
