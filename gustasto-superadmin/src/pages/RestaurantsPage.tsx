import { useState, useEffect } from 'react';
import api from '../api/axios';

interface Restaurant {
  id: string;
  name: string;
  logo: string;
  address: string;
  description: string;
  adminEmail: string;
  adminName: string;
  createdAt: string;
  branches?: Array<{ _id: string; name: string; address?: string; description?: string }>;
}

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  
  // Delete confirm state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Form states
  const [name, setName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Branch states
  const [branches, setBranches] = useState<Array<{ _id?: string; name: string }>>([]);
  const [newBranchName, setNewBranchName] = useState('');
  
  // Feedback states
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'danger' } | null>(null);

  const uploadSingleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      showFeedback('Yalnız şəkil faylları yüklənə bilər', 'danger');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showFeedback('Şəkil ölçüsü maksimum 5MB olmalıdır', 'danger');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/super-admin/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setLogo(response.data.url);
      showFeedback('Loqo uğurla yükləndi!', 'success');
    } catch (error: any) {
      console.error('Logo upload failed', error);
      const errMsg = error.response?.data?.message || 'Loqo yüklənməsi zamanı xəta baş verdi';
      showFeedback(errMsg, 'danger');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadSingleFile(file);
    }
  };

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    setLoading(true);
    try {
      const response = await api.get('/super-admin/restaurants');
      setRestaurants(response.data);
    } catch (error) {
      console.error('Restaurants load failed', error);
      showFeedback('Məlumatların yüklənməsi zamanı xəta baş verdi', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const showFeedback = (text: string, type: 'success' | 'danger') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleAddBranch = () => {
    if (!newBranchName.trim()) return;
    if (branches.some(b => b.name.toLowerCase() === newBranchName.trim().toLowerCase())) {
      showFeedback('Bu adda filial artıq əlavə edilib', 'danger');
      return;
    }
    setBranches([...branches, { name: newBranchName.trim() }]);
    setNewBranchName('');
  };

  const handleRemoveBranch = (index: number) => {
    setBranches(branches.filter((_, i) => i !== index));
  };

  const openAddModal = () => {
    setEditingRestaurant(null);
    setName('');
    setAdminName('');
    setAdminEmail('');
    setAdminPassword('');
    setAddress('');
    setDescription('');
    setLogo('');
    setBranches([]);
    setNewBranchName('');
    setIsModalOpen(true);
  };

  const openEditModal = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setName(restaurant.name);
    setAdminName(restaurant.adminName);
    setAdminEmail(restaurant.adminEmail);
    setAdminPassword(''); // Leave empty, only update if typed
    setAddress(restaurant.address);
    setDescription(restaurant.description);
    setLogo(restaurant.logo);
    setBranches(restaurant.branches || []);
    setNewBranchName('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (editingRestaurant) {
        // Edit Restaurant
        const updateData: any = {
          name,
          adminName,
          adminEmail,
          address,
          description,
          logo,
          branches: branches.map(b => ({ name: b.name })),
        };
        if (adminPassword) {
          updateData.adminPassword = adminPassword;
        }

        await api.put(`/super-admin/restaurants/${editingRestaurant.id}`, updateData);
        showFeedback(`${name} restoranı uğurla yeniləndi!`, 'success');
        setIsModalOpen(false);
        loadRestaurants();
      } else {
        // Create Restaurant (password is required here)
        if (!adminPassword) {
          showFeedback('Yeni restoran üçün admin şifrəsi mütləqdir', 'danger');
          setActionLoading(false);
          return;
        }

        const createData = {
          name,
          adminName,
          adminEmail,
          adminPassword,
          address,
          description,
          logo,
          branches: branches.map(b => ({ name: b.name })),
        };

        await api.post('/super-admin/restaurants', createData);
        showFeedback(`${name} restoranı uğurla yaradıldı!`, 'success');
        setIsModalOpen(false);
        loadRestaurants();
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Əməliyyat zamanı xəta baş verdi';
      showFeedback(errorMsg, 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setActionLoading(true);
    try {
      await api.delete(`/super-admin/restaurants/${deleteId}`);
      showFeedback('Restoran sistemdən uğurla silindi!', 'success');
      setDeleteId(null);
      loadRestaurants();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Silmə zamanı xəta baş verdi';
      showFeedback(errorMsg, 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredRestaurants = restaurants.filter((r) => {
    const search = searchQuery.toLowerCase();
    return (
      r.name.toLowerCase().includes(search) ||
      r.adminEmail.toLowerCase().includes(search) ||
      r.address.toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-wide">Restoranlar</h1>
          <p className="text-dark-400 mt-1 font-medium">Bütün restoranların və admin hesablarının idarə olunması</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold transition-all duration-200 shadow-lg shadow-primary-500/10 active:scale-[0.98]"
        >
          <span className="material-icons-round text-[20px]">add</span>
          Yeni Restoran
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border animate-scale-in flex items-center gap-3 ${
          message.type === 'success'
            ? 'bg-success-500/10 border-success-500/20 text-success-400'
            : 'bg-danger-500/10 border-danger-500/20 text-danger-400'
        }`}>
          <span className="material-icons-round">{message.type === 'success' ? 'check_circle' : 'error'}</span>
          <p className="text-sm font-semibold">{message.text}</p>
        </div>
      )}

      {/* Filter and Table Card */}
      <div className="bg-dark-900 rounded-3xl border border-dark-800 shadow-xl overflow-hidden">
        {/* Top filter bar */}
        <div className="p-6 border-b border-dark-800 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <span className="material-icons-round text-dark-500 text-[20px] absolute left-3.5 top-3.5">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-dark-950/80 border border-dark-800 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all font-medium text-sm"
              placeholder="Restoran adı, ünvan və ya email ilə axtar..."
            />
          </div>
        </div>

        {/* Table representation */}
        {loading ? (
          <div className="p-16 flex items-center justify-center">
            <span className="material-icons-round animate-spin text-primary-500 text-4xl">refresh</span>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="p-16 text-center text-dark-500 font-semibold text-lg">
            Restoran tapılmadı
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-dark-950/50 border-b border-dark-800 text-dark-400 text-xs font-bold uppercase tracking-wider">
                  <th className="p-4 pl-6">Restoran</th>
                  <th className="p-4">Admin məlumatları</th>
                  <th className="p-4">Ünvan</th>
                  <th className="p-4">Yaranma Tarixi</th>
                  <th className="p-4 pr-6 text-right">Fəaliyyətlər</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800/60">
                {filteredRestaurants.map((restaurant) => (
                  <tr key={restaurant.id} className="hover:bg-dark-850/30 transition-colors">
                    <td className="p-4 pl-6 flex items-center gap-3">
                      {restaurant.logo ? (
                        <img
                          src={restaurant.logo}
                          alt={restaurant.name}
                          className="w-11 h-11 rounded-xl object-cover border border-dark-700"
                        />
                      ) : (
                        <div className="w-11 h-11 bg-primary-500/10 text-primary-400 rounded-xl border border-primary-500/10 flex items-center justify-center">
                          <span className="material-icons-round text-2xl">storefront</span>
                        </div>
                      )}
                      <div>
                        <p className="text-white font-bold text-sm tracking-wide">{restaurant.name}</p>
                        <p className="text-xs text-dark-500 font-medium truncate max-w-xs">{restaurant.description || 'Təsvir daxil edilməyib'}</p>
                        {restaurant.branches && restaurant.branches.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5 max-w-xs">
                            {restaurant.branches.map((b) => (
                              <span key={b._id} className="px-1.5 py-0.5 bg-primary-500/10 border border-primary-500/10 text-primary-400 rounded-md text-[10px] font-bold">
                                {b.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-white text-sm font-semibold">{restaurant.adminName}</p>
                      <p className="text-xs text-dark-400 font-medium">{restaurant.adminEmail}</p>
                    </td>
                    <td className="p-4 text-dark-300 text-sm font-medium">{restaurant.address || '—'}</td>
                    <td className="p-4 text-dark-400 text-xs font-medium">
                      {new Date(restaurant.createdAt).toLocaleDateString('az-AZ', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => openEditModal(restaurant)}
                          className="p-2 bg-dark-950/60 hover:bg-primary-500/10 text-dark-400 hover:text-primary-400 rounded-lg border border-dark-800 hover:border-primary-500/20 transition-all active:scale-95"
                          title="Redaktə et"
                        >
                          <span className="material-icons-round text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteId(restaurant.id)}
                          className="p-2 bg-dark-950/60 hover:bg-danger-500/10 text-dark-400 hover:text-danger-400 rounded-lg border border-dark-800 hover:border-danger-500/20 transition-all active:scale-95"
                          title="Sil"
                        >
                          <span className="material-icons-round text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            onClick={() => !actionLoading && setIsModalOpen(false)}
            className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm transition-opacity"
          ></div>
          
          {/* Modal Container */}
          <div className="bg-dark-900 rounded-3xl border border-dark-800 w-full max-w-xl overflow-hidden relative z-10 shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-dark-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="material-icons-round text-primary-400">
                  {editingRestaurant ? 'edit' : 'add_circle'}
                </span>
                {editingRestaurant ? 'Restoranı Redaktə Et' : 'Yeni Restoran Yarat'}
              </h3>
              <button
                disabled={actionLoading}
                onClick={() => setIsModalOpen(false)}
                className="text-dark-500 hover:text-white disabled:opacity-50 transition-colors"
              >
                <span className="material-icons-round">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-dark-400 uppercase tracking-wider mb-2">Restoran Adı *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-dark-950 border border-dark-800 rounded-xl text-white placeholder-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all font-medium text-sm"
                    placeholder="Məs. Gusto Sahil"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-dark-400 uppercase tracking-wider mb-2">Restoran Loqosu (seçimə bağlı)</label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative group/logo w-full h-[120px] bg-dark-950/60 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 ${
                      isDragOver
                        ? 'border-primary-500 bg-primary-500/5'
                        : 'border-dark-800 hover:border-primary-500/50'
                    }`}
                  >
                    {uploading ? (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <span className="material-icons-round animate-spin text-primary-500 text-3xl">refresh</span>
                        <span className="text-xs text-dark-400 font-semibold">Loqo yüklənir...</span>
                      </div>
                    ) : logo ? (
                      <div className="relative w-full h-full flex items-center justify-center bg-dark-950">
                        <img
                          src={logo}
                          alt="Restaurant Logo"
                          className="max-h-full max-w-full object-contain p-2"
                        />
                        <div className="absolute inset-0 bg-dark-950/85 opacity-0 group-hover/logo:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-200">
                          <button
                            type="button"
                            onClick={() => document.getElementById('logo-file-input')?.click()}
                            className="p-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-all active:scale-95 flex items-center justify-center shadow-lg"
                            title="Dəyişdir"
                          >
                            <span className="material-icons-round text-[18px]">edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLogo('');
                            }}
                            className="p-2 bg-danger-600 hover:bg-danger-500 text-white rounded-xl transition-all active:scale-95 flex items-center justify-center shadow-lg"
                            title="Sil"
                          >
                            <span className="material-icons-round text-[18px]">delete</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => document.getElementById('logo-file-input')?.click()}
                        className="flex flex-col items-center justify-center text-center p-4 w-full h-full"
                      >
                        <span className="material-icons-round text-dark-500 group-hover/logo:text-primary-400 text-3xl mb-1.5 transition-colors">cloud_upload</span>
                        <span className="text-xs text-dark-300 font-bold group-hover/logo:text-white transition-colors">Yükləmək üçün klikləyin</span>
                        <span className="text-[10px] text-dark-500 mt-1 font-medium">Şəkli buraya sürükləyin (Maks. 5MB)</span>
                      </div>
                    )}
                    
                    <input
                      id="logo-file-input"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          uploadSingleFile(file);
                        }
                      }}
                      className="hidden"
                      disabled={uploading}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-400 uppercase tracking-wider mb-2">Ünvan (seçimə bağlı)</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 bg-dark-950 border border-dark-800 rounded-xl text-white placeholder-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all font-medium text-sm"
                  placeholder="Məs. Bakı bulvarı, Dənizkənarı küç. 5"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-400 uppercase tracking-wider mb-2">Qısa Təsvir (seçimə bağlı)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-dark-950 border border-dark-800 rounded-xl text-white placeholder-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all font-medium text-sm resize-none"
                  placeholder="Restoran haqqında məlumat..."
                  rows={2}
                />
              </div>

              {/* Filiallar Section */}
              <div className="border-t border-dark-800 pt-4 mt-2">
                <h4 className="text-sm font-bold text-primary-400 mb-3">Filiallar (seçimə bağlı)</h4>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newBranchName}
                    onChange={(e) => setNewBranchName(e.target.value)}
                    className="flex-1 px-4 py-2 bg-dark-950 border border-dark-800 rounded-xl text-white placeholder-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all font-medium text-sm"
                    placeholder="Filial adı əlavə edin (məs. Nizami)"
                  />
                  <button
                    type="button"
                    onClick={handleAddBranch}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold transition-all text-sm active:scale-95 flex items-center gap-1.5"
                  >
                    <span className="material-icons-round text-base">add</span>
                    Əlavə et
                  </button>
                </div>

                {branches.length > 0 ? (
                  <div className="flex flex-wrap gap-2 p-3 bg-dark-950/60 border border-dark-800/80 rounded-2xl max-h-[120px] overflow-y-auto">
                    {branches.map((branch, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1.5 px-3 py-1 bg-dark-900 border border-dark-800 text-white rounded-xl text-xs font-semibold hover:border-danger-500/30 transition-colors group/branch"
                      >
                        <span>{branch.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveBranch(index)}
                          className="text-dark-500 hover:text-danger-400 transition-colors focus:outline-none"
                        >
                          <span className="material-icons-round text-sm">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-dark-500 font-medium italic">Hələ filial əlavə edilməyib. Əgər filial əlavə edilməsə, restoran tək rejimdə işləyəcək.</p>
                )}
              </div>

              <div className="border-t border-dark-800 pt-4 mt-2">
                <h4 className="text-sm font-bold text-primary-400 mb-3">Admin Giriş Məlumatları</h4>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-dark-400 uppercase tracking-wider mb-2">Admin Ad Soyad *</label>
                      <input
                        type="text"
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-dark-950 border border-dark-800 rounded-xl text-white placeholder-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all font-medium text-sm"
                        placeholder="Məs. Əli Məmmədov"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-dark-400 uppercase tracking-wider mb-2">Admin Email *</label>
                      <input
                        type="email"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        className="w-full px-4 py-2.5 bg-dark-950 border border-dark-800 rounded-xl text-white placeholder-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all font-medium text-sm"
                        placeholder="admin@restaurant.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-dark-400 uppercase tracking-wider mb-2">
                      Admin Şifrə {editingRestaurant ? '(yalnız dəyişmək istədikdə yazın)' : '*'}
                    </label>
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-dark-950 border border-dark-800 rounded-xl text-white placeholder-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all font-medium text-sm"
                      placeholder={editingRestaurant ? '••••••••' : 'Ən azı 6 simvol'}
                      required={!editingRestaurant}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-dark-800 pt-4 mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-dark-950 hover:bg-dark-800 text-dark-300 hover:text-white border border-dark-800 rounded-xl font-bold transition-all text-sm"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white rounded-xl font-bold transition-all text-sm flex items-center gap-2 active:scale-95"
                >
                  {actionLoading && <span className="material-icons-round animate-spin text-[18px]">refresh</span>}
                  Yadda Saxla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => !actionLoading && setDeleteId(null)}
            className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm transition-opacity"
          ></div>

          <div className="bg-dark-900 rounded-3xl border border-dark-800 max-w-md w-full p-6 relative z-10 shadow-2xl animate-scale-in">
            <div className="text-center">
              <span className="material-icons-round text-danger-500 text-5xl bg-danger-500/10 p-4 rounded-full border border-danger-500/20 mb-4 inline-block">
                warning
              </span>
              <h3 className="text-xl font-bold text-white mb-2">Restoranı Silmək İstəyirsiniz?</h3>
              <p className="text-dark-400 text-sm font-medium mb-6">
                Bu restoranı sildikdə onunla əlaqəli bütün admin hesabı, masalar, QR kodlar və müştəri feedbackləri <strong>geri qaytarıla bilməyəcək şəkildə silinəcək</strong>.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                disabled={actionLoading}
                onClick={() => setDeleteId(null)}
                className="px-5 py-2.5 bg-dark-950 hover:bg-dark-800 text-dark-300 hover:text-white border border-dark-800 rounded-xl font-bold transition-all text-sm"
              >
                Ləğv et
              </button>
              <button
                disabled={actionLoading}
                onClick={handleDelete}
                className="px-5 py-2.5 bg-danger-600 hover:bg-danger-500 disabled:opacity-50 text-white rounded-xl font-bold transition-all text-sm flex items-center gap-2 active:scale-95"
              >
                {actionLoading && <span className="material-icons-round animate-spin text-[18px]">refresh</span>}
                Bəli, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
