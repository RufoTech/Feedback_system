import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  useGetTablesQuery, 
  useCreateTableMutation, 
  useDeleteTableMutation,
  type TableItem 
} from '../store/services/adminApi';

export const TablesManagement: React.FC = () => {
  const { admin } = useAuth();
  const restaurantId = admin?.restaurantId || admin?.id || ''; // admin.restaurantId or admin.id as fallback

  const { data: tables = [], isLoading, error } = useGetTablesQuery(restaurantId, {
    skip: !restaurantId,
  });

  const [createTable, { isLoading: isCreating }] = useCreateTableMutation();
  const [deleteTable, { isLoading: isDeleting }] = useDeleteTableMutation();

  const [newTableNumber, setNewTableNumber] = useState('');
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Modals state
  const [selectedTableForQr, setSelectedTableForQr] = useState<TableItem | null>(null);
  const [tableToDelete, setTableToDelete] = useState<TableItem | null>(null);

  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableNumber.trim()) {
      setMsg({ type: 'error', text: 'Zəhmət olmasa masa nömrəsini daxil edin' });
      return;
    }

    setMsg(null);

    try {
      await createTable({ restaurantId, tableNumber: newTableNumber.trim() }).unwrap();
      setMsg({ type: 'success', text: `Masa ${newTableNumber} uğurla əlavə olundu!` });
      setNewTableNumber('');
    } catch (err: any) {
      console.error(err);
      setMsg({ type: 'error', text: err.data?.message || 'Masa əlavə edilərkən xəta baş verdi' });
    }
  };

  const handleDeleteTable = async () => {
    if (!tableToDelete) return;
    try {
      await deleteTable(tableToDelete._id).unwrap();
      setMsg({ type: 'success', text: `Masa ${tableToDelete.tableNumber} uğurla silindi!` });
      setTableToDelete(null);
    } catch (err: any) {
      console.error(err);
      setMsg({ type: 'error', text: err.data?.message || 'Masa silinərkən xəta baş verdi' });
    }
  };

  const handlePrintQR = (qrUrl: string, tableNum: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const qrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrUrl)}`;

    printWindow.document.write(`
      <html>
        <head>
          <title>Gusto - Masa ${tableNum} QR Kod</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 90vh;
              background-color: white;
              margin: 0;
              color: #1b1c1c;
            }
            .card {
              border: 2px solid #735c00;
              border-radius: 20px;
              padding: 40px;
              text-align: center;
              box-shadow: 0 4px 20px rgba(0,0,0,0.05);
              max-width: 350px;
            }
            h1 {
              color: #735c00;
              margin: 0 0 10px 0;
              font-size: 32px;
              letter-spacing: 1px;
            }
            p {
              margin: 0 0 30px 0;
              font-size: 18px;
              color: #6b7280;
              font-weight: 500;
            }
            img {
              margin-bottom: 20px;
            }
            .footer {
              font-size: 12px;
              color: #9ca3af;
              margin-top: 10px;
            }
            @media print {
              .print-btn { display: none; }
            }
            .print-btn {
              margin-top: 20px;
              background-color: #735c00;
              color: white;
              border: none;
              padding: 10px 24px;
              font-size: 16px;
              font-weight: bold;
              border-radius: 8px;
              cursor: pointer;
              transition: opacity 0.2s;
            }
            .print-btn:hover { opacity: 0.9; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>GUSTO</h1>
            <p>Masa ${tableNum}</p>
            <img src="${qrImageSrc}" alt="QR Code" width="250" height="250" />
            <div class="footer">Rəy, Təklif və Şikayət üçün QR kodu skan edin</div>
            <button class="print-btn" onclick="window.print()">Çap Et</button>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8 pb-24 md:pb-8">
      {/* Page Header */}
      <div>
        <h2 className="font-headline-md text-headline-md text-on-surface">Masaların İdarə Edilməsi</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Yeni masalar əlavə edin, QR kodları yükləyin və çap edin.
        </p>
      </div>

      {/* Add Table Form */}
      <div className="bg-surface rounded-xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/20 max-w-xl">
        <h3 className="text-title-lg font-bold text-on-surface mb-4">Yeni Masa Əlavə Et</h3>
        
        {msg && (
          <div className={`p-4 rounded-xl text-body-md mb-4 flex items-center space-x-2 ${
            msg.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-error-container/20 text-error border border-error/20'
          }`}>
            <span className="material-symbols-outlined shrink-0 text-xl">
              {msg.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span>{msg.text}</span>
          </div>
        )}

        <form onSubmit={handleAddTable} className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Masa nömrəsi (məsələn: 05, VIP 2)"
              value={newTableNumber}
              onChange={(e) => setNewTableNumber(e.target.value)}
              className="block w-full px-4 py-3 bg-[#f5f3f3] hover:bg-[#efeded] focus:bg-white border-none rounded-xl text-body-md text-[#1b1c1c] placeholder:text-[#4d4635]/40 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200"
              disabled={isCreating}
            />
          </div>
          <button
            type="submit"
            disabled={isCreating}
            className="px-6 bg-primary text-on-primary rounded-xl font-label-md text-label-md font-bold hover:bg-primary/95 transition-all flex items-center shrink-0 disabled:opacity-50"
          >
            {isCreating ? (
              <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px] mr-2">add</span>
                Əlavə Et
              </>
            )}
          </button>
        </form>
      </div>

      {/* Tables List */}
      <div className="bg-surface rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/20 overflow-hidden">
        <div className="p-4 border-b border-outline-variant/30 bg-surface-container/30">
          <h3 className="text-title-lg font-bold text-on-surface">Masa Siyahısı</h3>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-on-surface-variant font-medium text-body-md animate-pulse">Masalar yüklənir...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-error">
            <span className="material-symbols-outlined text-4xl mb-2">error</span>
            <p className="font-semibold text-body-md">Məlumatlar yüklənərkən xəta baş verdi</p>
          </div>
        ) : tables.length === 0 ? (
          <div className="p-8 text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl mb-2 text-primary/30">deck</span>
            <p className="font-semibold text-body-md">Heç bir masa tapılmadı. Yeni masa əlavə edin!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container/10 border-b border-outline-variant/20">
                  <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant font-bold">Masa Nömrəsi</th>
                  <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant font-bold">QR Kod URL</th>
                  <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant font-bold text-center">QR Kod Prevyu</th>
                  <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant font-bold text-right">Fəaliyyət</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {tables.map((table) => {
                  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(table.qrCodeUrl)}`;
                  return (
                    <tr key={table._id} className="hover:bg-surface-container/20 transition-colors">
                      <td className="py-4 px-6 font-body-md text-body-md font-bold text-on-surface">
                        Masa {table.tableNumber}
                      </td>
                      <td className="py-4 px-6 font-label-sm text-label-sm text-on-surface-variant truncate max-w-[200px]" title={table.qrCodeUrl}>
                        {table.qrCodeUrl}
                      </td>
                      <td className="py-2 px-6">
                        <div className="flex justify-center items-center">
                          <button
                            onClick={() => setSelectedTableForQr(table)}
                            className="border border-outline-variant/30 rounded-lg p-1 bg-white hover:scale-105 transition-transform cursor-pointer"
                            title="QR kodu böyüt"
                          >
                            <img
                              src={qrSrc}
                              alt={`Masa ${table.tableNumber} QR`}
                              width="50"
                              height="50"
                              className="object-contain"
                            />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedTableForQr(table)}
                            className="px-3 py-2 bg-surface text-primary font-label-sm text-label-sm font-bold border border-primary/40 hover:bg-primary-container/20 rounded-lg transition-colors inline-flex items-center"
                          >
                            <span className="material-symbols-outlined text-[18px] mr-1">qr_code_2</span>
                            QR Göstər
                          </button>
                          <button
                            onClick={() => handlePrintQR(table.qrCodeUrl, table.tableNumber)}
                            className="px-3 py-2 bg-surface text-on-surface-variant font-label-sm text-label-sm font-bold border border-outline-variant hover:bg-surface-container/50 rounded-lg transition-colors inline-flex items-center"
                          >
                            <span className="material-symbols-outlined text-[18px] mr-1">print</span>
                            Çap Et
                          </button>
                          <button
                            onClick={() => setTableToDelete(table)}
                            className="px-3 py-2 bg-error-container/10 text-error font-label-sm text-label-sm font-bold border border-error/30 hover:bg-error-container/20 rounded-lg transition-colors inline-flex items-center"
                          >
                            <span className="material-symbols-outlined text-[18px] mr-1">delete</span>
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QR Code Popup Modal */}
      {selectedTableForQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-2xl p-6 md:p-8 max-w-md w-full border border-outline-variant/30 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setSelectedTableForQr(null)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container/50 transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            
            <div className="text-center space-y-6">
              <div>
                <h3 className="text-headline-sm font-bold text-on-surface">Masa QR Kodu</h3>
                <p className="text-body-md text-on-surface-variant mt-1">Masa {selectedTableForQr.tableNumber}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl inline-block border border-outline-variant/20 shadow-inner">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(selectedTableForQr.qrCodeUrl)}`} 
                  alt={`Masa ${selectedTableForQr.tableNumber} QR`}
                  className="w-48 h-48 md:w-60 md:h-60 mx-auto object-contain"
                />
              </div>

              <div className="text-body-xs text-on-surface-variant/80 select-all break-all bg-surface-container/40 p-3 rounded-lg border border-outline-variant/10 font-mono">
                {selectedTableForQr.qrCodeUrl}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedTableForQr(null)}
                  className="flex-1 py-3 px-4 rounded-xl border border-outline-variant hover:bg-surface-container/30 font-label-md text-label-md font-bold text-on-surface transition-colors"
                >
                  Bağla
                </button>
                <button
                  onClick={() => handlePrintQR(selectedTableForQr.qrCodeUrl, selectedTableForQr.tableNumber)}
                  className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 font-label-md text-label-md font-bold text-on-primary transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">print</span>
                  Çap Et
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {tableToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-2xl p-6 max-w-sm w-full border border-outline-variant/30 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-error-container/20 text-error flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-3xl">warning</span>
              </div>
              
              <div>
                <h3 className="text-title-lg font-bold text-on-surface">Masanı silmək istəyirsiniz?</h3>
                <p className="text-body-md text-on-surface-variant mt-2">
                  Masa {tableToDelete.tableNumber} silinəcək və bu masaya aid QR kod artıq etibarsız olacaq.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setTableToDelete(null)}
                  disabled={isDeleting}
                  className="flex-1 py-2 px-4 rounded-xl border border-outline-variant hover:bg-surface-container/30 font-label-md text-label-md font-bold text-on-surface transition-colors disabled:opacity-50"
                >
                  Ləğv Et
                </button>
                <button
                  onClick={handleDeleteTable}
                  disabled={isDeleting}
                  className="flex-1 py-2 px-4 rounded-xl bg-error hover:bg-error/90 font-label-md text-label-md font-bold text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Bəli, Sil'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
