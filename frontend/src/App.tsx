import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BagProvider } from './context/BagContext';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { Bag } from './pages/Bag';
import { AddItem } from './pages/AddItem';
import { Navbar } from './components/Navbar';
import { FloatingAddButton } from './components/FloatingAddButton';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="empty-state" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="loading-spinner" style={{ borderColor: 'var(--olive-light) rgba(0,0,0,0.1) rgba(0,0,0,0.1) rgba(0,0,0,0.1)', width: '40px', height: '40px' }}></span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="empty-state" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="loading-spinner" style={{ borderColor: 'var(--olive-light) rgba(0,0,0,0.1) rgba(0,0,0,0.1) rgba(0,0,0,0.1)', width: '40px', height: '40px' }}></span>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/bag" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BagProvider>
          <Routes>
            <Route path="/signin" element={<PublicRoute><SignIn /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
            <Route path="/bag" element={<ProtectedRoute><Bag /></ProtectedRoute>} />
            <Route
              path="/add"
              element={
                <ProtectedRoute>
                  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                    <Navbar />
                    <AddItem />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/bag" replace />} />
          </Routes>
      <FloatingAddButton />
        </BagProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
