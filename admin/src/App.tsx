import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Orders } from './pages/Orders';
import { Restaurants } from './pages/Restaurants';
import { RestaurantEdit } from './pages/RestaurantEdit';
import { MenuEditor } from './pages/MenuEditor';
import type { ReactNode } from 'react';

function AuthGuard({ children }: { children: ReactNode }) {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center">
        <div className="text-[#6B6560] font-body">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function GuestGuard({ children }: { children: ReactNode }) {
  const { session, isLoading } = useAuth();

  if (isLoading) return null;
  if (session) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route
            path="/login"
            element={
              <GuestGuard>
                <Login />
              </GuestGuard>
            }
          />

          {/* Protected */}
          <Route
            element={
              <AuthGuard>
                <Layout />
              </AuthGuard>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/restaurants/:id" element={<RestaurantEdit />} />
            <Route path="/restaurants/:id/menu" element={<MenuEditor />} />
          </Route>

          {/* Redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
