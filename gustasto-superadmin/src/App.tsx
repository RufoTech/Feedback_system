import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RestaurantsPage from './pages/RestaurantsPage';
import SuperAdminLayout from './layout/SuperAdminLayout';
import { AuthGuard } from './guards/AuthGuard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<AuthGuard />}>
          <Route element={<SuperAdminLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/restaurants" element={<RestaurantsPage />} />
            <Route path="" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
