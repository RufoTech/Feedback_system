import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { adminStore } from './store/adminStore';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './guards/ProtectedRoute';
import { AdminLayout } from './layout/AdminLayout';
import { DashboardHome } from './pages/DashboardHome';
import { Analytics } from './pages/Analytics';
import { Login } from './pages/Login';
import { TablesManagement } from './pages/TablesManagement';

function App() {
  return (
    <Provider store={adminStore}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Login marşrutu qorunmur, hər kəs daxil ola bilər */}
            <Route path="/login" element={<Login />} />

            {/* Qorunan admin marşrutları */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardHome />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="tables" element={<TablesManagement />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  );
}

export default App;
