import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, User, Search, Download, Trash2, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCarContext } from '../contexts/CarContext';

const ProfilePage = () => {
  const { user } = useAuth();
  const { savedCars, getCarById, removeSavedCar } = useCarContext();
  const [activeTab, setActiveTab] = useState<'favorites' | 'searches' | 'profile'>('favorites');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your profile</p>
          <Link
            to="/quiz"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all"
          >
            Get Started
          </Link>
        </div>
      </div>
    );
  }

  const favoriteCarsList = savedCars.map(id => getCarById(id)).filter(Boolean);

  const mockSearchHistory = [
    {
      id: '1',
      query: 'Family SUV under 20L with good mileage',
      date: '2 days ago',
      results: 8
    },
    {
      id: '2', 
      query: 'Electric cars with 300km range',
      date: '1 week ago',
      results: 3
    },
    {
      id: '3',
      query: 'Luxury sedans with hybrid technology',
      date: '2 weeks ago', 
      results: 5
    }
  ];

  const exportFavorites = () => {
    // Mock PDF export functionality
    alert('PDF export feature coming soon!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
              {user.role === 'admin' && (
                <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-medium mt-1">
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b">
            <div className="flex space-x-8 px-6">
              {[
                { id: 'favorites', label: 'My Favorites', icon: <Heart className="w-4 h-4" />, count: favoriteCarsList.length },
                { id: 'searches', label: 'Search History', icon: <Search className="w-4 h-4" />, count: mockSearchHistory.length },
                { id: 'profile', label: 'Profile Settings', icon: <User className="w-4 h-4" /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-600 hover:text-purple-600'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'favorites' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Saved Cars</h2>
                  {favoriteCarsList.length > 0 && (
                    <div className="flex space-x-3">
                      <button
                        onClick={exportFavorites}
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export PDF</span>
                      </button>
                      {favoriteCarsList.length >= 2 && (
                        <Link
                          to={`/compare?cars=${savedCars.slice(0, 3).join(',')}`}
                          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                        >
                          <span>Compare All</span>
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  )}
                </div>

                {favoriteCarsList.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved cars yet</h3>
                    <p className="text-gray-600 mb-6">Start browsing cars and save your favorites</p>
                    <Link
                      to="/browse"
                      className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all inline-block"
                    >
                      Browse Cars
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteCarsList.map((car) => (
                      <div key={car.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all">
                        <img
                          src={car.image}
                          alt={`${car.make} ${car.model}`}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="font-bold text-gray-900 mb-1">
                            {car.make} {car.model}
                          </h3>
                          <p className="text-gray-600 mb-2">{car.year} • {car.bodyType}</p>
                          <p className="font-bold text-purple-600 mb-3">
                            ₹{car.priceRange.min}L - ₹{car.priceRange.max}L
                          </p>
                          
                          <div className="flex space-x-2">
                            <Link
                              to={`/car/${car.id}`}
                              className="flex-1 bg-purple-600 text-white px-3 py-2 rounded-lg text-center hover:bg-purple-700 transition-all text-sm"
                            >
                              View Details
                            </Link>
                            <button
                              onClick={() => removeSavedCar(car.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Remove from favorites"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'searches' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Searches</h2>
                
                {mockSearchHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No search history</h3>
                    <p className="text-gray-600 mb-6">Your search history will appear here</p>
                    <Link
                      to="/quiz"
                      className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all inline-block"
                    >
                      Take Quiz
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mockSearchHistory.map((search) => (
                      <div key={search.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-all">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{search.query}</h3>
                            <p className="text-sm text-gray-600">
                              {search.results} results • {search.date}
                            </p>
                          </div>
                          <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                            View Results
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Settings</h2>
                
                <div className="max-w-md space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={user.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Type
                    </label>
                    <input
                      type="text"
                      value={user.role === 'admin' ? 'Administrator' : 'Regular User'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      readOnly
                    />
                  </div>
                  
                  <div className="pt-4">
                    <p className="text-sm text-gray-500 mb-4">
                      Profile editing features coming soon...
                    </p>
                    <button className="bg-gray-400 text-white px-6 py-2 rounded-lg cursor-not-allowed">
                      Update Profile
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;