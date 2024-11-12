import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TrendingUp, Moon, Sun, Star, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useWatchlist } from '../context/WatchlistContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const { watchlist } = useWatchlist();
    const { isAuthenticated, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/auth');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-lg transition-colors duration-200">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        <span className="text-xl font-bold text-gray-900 dark:text-white">StockVision</span>
                    </Link>
                    <div className="flex items-center space-x-6">
                        {isAuthenticated && (
                            <Link
                                to="/watchlist"
                                className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                                <Star className="h-5 w-5" />
                                <span>Watchlist ({watchlist.length})</span>
                            </Link>
                        )}
                        {!isAuthenticated && location.pathname !== '/auth' && (
                            <Link
                                to="/auth"
                                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                                Login
                            </Link>
                        )}
                        {isAuthenticated && (
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                                <LogOut className="h-5 w-5" />
                                <span>Logout</span>
                            </button>
                        )}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? (
                                <Sun className="h-5 w-5 text-gray-300" />
                            ) : (
                                <Moon className="h-5 w-5 text-gray-700" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
