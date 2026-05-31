import React, { useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useGetStatsQuery } from '../store/services/adminApi';
import { FaConciergeBell } from 'react-icons/fa';

declare global {
  interface Window {
    Chart: any;
  }
}

export const Analytics: React.FC = () => {
  const { selectedBranchId } = useOutletContext<{ selectedBranchId: string }>();
  const { data: stats, isLoading, error } = useGetStatsQuery(selectedBranchId, {
    pollingInterval: 8000, // Hər 8 saniyədən bir yenilənsin
  });

  const volumeCanvasRef = useRef<HTMLCanvasElement>(null);
  const categoryCanvasRef = useRef<HTMLCanvasElement>(null);
  const volumeChartRef = useRef<any>(null);
  const categoryChartRef = useRef<any>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (isLoading || error || !stats) return;

    const initCharts = () => {
      const Chart = window.Chart;
      if (!Chart) return;

      Chart.defaults.font.family = "'Inter', sans-serif";
      Chart.defaults.color = '#4d4635';

      const primaryColor = '#735c00';
      const gridColor = '#e3e2e2';

      // 1. Volume Line Chart
      const volCtx = volumeCanvasRef.current?.getContext('2d');
      if (volCtx) {
        if (volumeChartRef.current) {
          volumeChartRef.current.destroy();
        }

        const gradient = volCtx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(212, 175, 55, 0.4)');
        gradient.addColorStop(1, 'rgba(212, 175, 55, 0.0)');

        volumeChartRef.current = new Chart(volCtx, {
          type: 'line',
          data: {
            labels: stats.chartLabels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
              label: 'Müraciətlər',
              data: stats.chartData || [0, 0, 0, 0, 0, 0, 0],
              borderColor: primaryColor,
              backgroundColor: gradient,
              borderWidth: 2,
              pointBackgroundColor: '#fff',
              pointBorderColor: primaryColor,
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
              fill: true,
              tension: 0.4,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: '#303031',
                titleFont: { size: 14, family: 'Inter', weight: '600' },
                bodyFont: { size: 14, family: 'Inter' },
                padding: 12,
                cornerRadius: 8,
                displayColors: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: { color: gridColor, drawBorder: false },
                border: { display: false },
              },
              x: {
                grid: { display: false },
                border: { display: false },
              },
            },
            interaction: { intersect: false, mode: 'index' },
          },
        });
      }

      // 2. Category Doughnut Chart
      const catCtx = categoryCanvasRef.current?.getContext('2d');
      if (catCtx) {
        if (categoryChartRef.current) {
          categoryChartRef.current.destroy();
        }

        const distribution = stats.typeDistribution || { service: 0, suggestions: 0, complaints: 0 };

        categoryChartRef.current = new Chart(catCtx, {
          type: 'doughnut',
          data: {
            labels: ['Rəylər', 'Təkliflər', 'Şikayətlər'],
            datasets: [{
              data: [distribution.service, distribution.suggestions, distribution.complaints],
              backgroundColor: [primaryColor, '#b5b3ae', '#ffdad6'],
              borderWidth: 0,
              hoverOffset: 4,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: '#303031',
                bodyFont: { size: 14, family: 'Inter' },
                padding: 12,
                cornerRadius: 8,
              },
            },
          },
        });
      }
    };

    if (window.Chart) {
      initCharts();
    } else if (!scriptLoaded.current) {
      scriptLoaded.current = true;
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = initCharts;
      document.body.appendChild(script);
    } else {
      // Script is loading, check periodically
      const interval = setInterval(() => {
        if (window.Chart) {
          clearInterval(interval);
          initCharts();
        }
      }, 100);
    }
  }, [stats, isLoading, error]);

  // Clean up charts on unmount
  useEffect(() => {
    return () => {
      if (volumeChartRef.current) volumeChartRef.current.destroy();
      if (categoryChartRef.current) categoryChartRef.current.destroy();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-3"></div>
        <p className="text-on-surface-variant font-medium text-body-md animate-pulse">Statistikalar yüklənir...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background text-error">
        <span className="material-symbols-outlined text-4xl mb-2">error</span>
        <p className="font-semibold text-body-md">Məlumatlar yüklənərkən xəta baş verdi</p>
      </div>
    );
  }

  const distribution = stats.typeDistribution || { service: 0, suggestions: 0, complaints: 0 };
  const peak = stats.peakActivity || {
    service: { morning: 0, lunch: 0, dinner: 0 },
    feedback: { morning: 0, lunch: 0, dinner: 0 },
    payment: { morning: 0, lunch: 0, dinner: 0 },
  };

  return (
    <div className="flex-1 flex flex-col gap-stack-md p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-2">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Trendlər və İcmal</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Son 7 günlük müraciət statistikaları</p>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {/* CSAT Widget */}
        <div className="bg-surface rounded-xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-surface-container flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary-container/20 rounded-full blur-xl group-hover:bg-primary-container/30 transition-all"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Ortalama CSAT</h3>
            <span className="material-symbols-outlined text-primary bg-primary-container/20 p-2 rounded-lg">sentiment_very_satisfied</span>
          </div>
          <div className="relative z-10">
            <div className="flex items-baseline gap-2">
              <span className="font-display-lg text-display-lg text-on-surface">{stats.avgCsat}</span>
              <span className="font-body-md text-body-md text-on-surface-variant">/ 5.0</span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-primary font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[16px]">thumb_up</span>
              <span>Müştəri məmnuniyyəti dərəcəsi</span>
            </div>
          </div>
        </div>

        {/* Total Requests */}
        <div className="bg-surface rounded-xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-surface-container flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Ümumi Müraciət</h3>
            <span className="text-on-surface-variant bg-surface-container p-2 rounded-lg inline-flex"><FaConciergeBell /></span>
          </div>
          <div>
            <div className="font-display-lg text-display-lg text-on-surface">{stats.totalRequests}</div>
            <div className="flex items-center gap-1 mt-2 text-on-surface-variant font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              <span>Ümumi toplanmış məlumat həcmi</span>
            </div>
          </div>
        </div>

      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Request Volume */}
        <div className="lg:col-span-2 bg-surface rounded-xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-surface-container">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-title-lg text-title-lg text-on-surface">Müraciət Həcmi</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Son 7 günün qrafiki</p>
            </div>
          </div>
          <div className="h-64 w-full relative">
            <canvas ref={volumeCanvasRef} id="volumeChart"></canvas>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-surface rounded-xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-surface-container flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-title-lg text-title-lg text-on-surface">Kateqoriyalar</h3>
          </div>
          <div className="h-48 w-full relative flex-grow flex items-center justify-center">
            <canvas ref={categoryCanvasRef} id="categoryChart"></canvas>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex items-center justify-between font-label-sm text-label-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-on-surface-variant">Rəylər (Rating)</span>
              </div>
              <span className="font-semibold text-on-surface">{distribution.service}%</span>
            </div>
            <div className="flex items-center justify-between font-label-sm text-label-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#b5b3ae]"></div>
                <span className="text-on-surface-variant">Təkliflər</span>
              </div>
              <span className="font-semibold text-on-surface">{distribution.suggestions}%</span>
            </div>
            <div className="flex items-center justify-between font-label-sm text-label-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ffdad6]"></div>
                <span className="text-on-surface-variant">Şikayətlər</span>
              </div>
              <span className="font-semibold text-on-surface">{distribution.complaints}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Heatmap & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        {/* Peak Activity Heatmap */}
        <div className="bg-surface rounded-xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-surface-container">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-title-lg text-title-lg text-on-surface">Pik Aktivlik</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Müraciət növlərinin günün saatlarına görə sıxlığı</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-container">
                  <th className="py-2 px-3 font-label-sm text-label-sm text-on-surface-variant font-normal"></th>
                  <th className="py-2 px-3 font-label-sm text-label-sm text-on-surface-variant font-normal text-center">Səhər<br/>(8:00-12:00)</th>
                  <th className="py-2 px-3 font-label-sm text-label-sm text-on-surface-variant font-normal text-center">Nahar<br/>(12:00-16:00)</th>
                  <th className="py-2 px-3 font-label-sm text-label-sm text-on-surface-variant font-normal text-center">Axşam<br/>(16:00-22:00)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-surface-container">
                  <td className="py-3 px-3 font-label-md text-label-md text-on-surface">Rəylər</td>
                  <td className="py-3 px-3 text-center">
                    <div className="inline-block w-8 h-8 rounded bg-primary-container/20 border border-primary-container/30 flex items-center justify-center font-bold text-xs text-primary">{peak.service.morning}</div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="inline-block w-8 h-8 rounded bg-primary-container/80 border border-primary shadow-sm flex items-center justify-center font-bold text-xs text-[#ffe088]">{peak.service.lunch}</div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="inline-block w-8 h-8 rounded bg-primary border border-primary shadow-sm flex items-center justify-center font-bold text-xs text-white">{peak.service.dinner}</div>
                  </td>
                </tr>
                <tr className="border-b border-surface-container">
                  <td className="py-3 px-3 font-label-md text-label-md text-on-surface">Şikayətlər</td>
                  <td className="py-3 px-3 text-center">
                    <div className="inline-block w-8 h-8 rounded bg-surface-container border border-outline-variant flex items-center justify-center font-bold text-xs text-on-surface-variant">{peak.feedback.morning}</div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="inline-block w-8 h-8 rounded bg-primary-container/40 border border-primary-container/50 flex items-center justify-center font-bold text-xs text-primary">{peak.feedback.lunch}</div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="inline-block w-8 h-8 rounded bg-primary-container/60 border border-primary-container/70 flex items-center justify-center font-bold text-xs text-primary">{peak.feedback.dinner}</div>
                  </td>
                </tr>
                <tr className="border-b border-surface-container">
                  <td className="py-3 px-3 font-label-md text-label-md text-on-surface">Təkliflər</td>
                  <td className="py-3 px-3 text-center">
                    <div className="inline-block w-8 h-8 rounded bg-surface-container border border-outline-variant flex items-center justify-center font-bold text-xs text-on-surface-variant">{peak.payment.morning}</div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="inline-block w-8 h-8 rounded bg-primary-container/70 border border-primary-container/80 flex items-center justify-center font-bold text-xs text-primary">{peak.payment.lunch}</div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="inline-block w-8 h-8 rounded bg-primary-container/90 border border-primary shadow-sm flex items-center justify-center font-bold text-xs text-primary">{peak.payment.dinner}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Zones */}
        <div className="bg-surface rounded-xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-surface-container flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-title-lg text-title-lg text-on-surface">Ən Yüksək Reytinqli Masalar</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Müştəri məmnuniyyəti (CSAT) üzrə top zonalar</p>
            </div>
          </div>
          <div className="flex-grow flex flex-col gap-4">
            {stats.topZones && stats.topZones.map((zone, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container transition-colors border border-transparent hover:border-outline-variant">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
                    <span className="material-symbols-outlined text-[20px]">
                      {idx === 0 ? 'emoji_events' : idx === 1 ? 'deck' : 'chair'}
                    </span>
                  </div>
                  <div>
                    <div className="font-label-md text-label-md text-on-surface font-semibold">{zone.zoneName}</div>
                    <div className="font-label-sm text-label-sm text-on-surface-variant">{zone.description}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-title-lg text-title-lg text-on-surface">{zone.csat}%</div>
                  <div className="font-label-sm text-label-sm text-primary">CSAT</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
