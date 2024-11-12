import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import StockDashboard from './pages/StockDashboard';
import WatchlistPage from './pages/WatchlistPage';
import AuthPage from './pages/AuthPage';
import Navbar from './components/Navbar';
import { ThemeProvider } from './context/ThemeContext';
import { WatchlistProvider } from './context/WatchlistContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <WatchlistProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/" element={<SearchPage />} />
                  <Route
                    path="/stock/:symbol"
                    element={
                      <ProtectedRoute>
                        <StockDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/watchlist"
                    element={
                      <ProtectedRoute>
                        <WatchlistPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </BrowserRouter>
        </WatchlistProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
