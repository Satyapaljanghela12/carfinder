import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Menu, X, Car, Heart, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CarMatch</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/browse" className="text-gray-700 hover:text-purple-600 transition-colors">
              Browse Cars
            </Link>
            <Link to="/quiz" className="text-gray-700 hover:text-purple-600 transition-colors">
              Find My Car
            </Link>
            <Link to="/compare" className="text-gray-700 hover:text-purple-600 transition-colors">
              Compare
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-purple-600"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:block">{user.name}</span>
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Heart className="w-4 h-4 inline mr-2" />
                      My Favorites
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <BarChart3 className="w-4 h-4 inline mr-2" />
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/quiz"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                Get Started
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              <Link
                to="/browse"
                className="px-4 py-2 text-gray-700 hover:text-purple-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Browse Cars
              </Link>
              <Link
                to="/quiz"
                className="px-4 py-2 text-gray-700 hover:text-purple-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Find My Car
              </Link>
              <Link
                to="/compare"
                className="px-4 py-2 text-gray-700 hover:text-purple-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Compare
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;