import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Heart, Plus, Download, Filter, ArrowRight, CheckCircle, X } from 'lucide-react';
import { useCarContext } from '../contexts/CarContext';
import { useAuth } from '../contexts/AuthContext';

const ResultsPage = () => {
  const navigate = useNavigate();
  const { quizResults, recommendations, savedCars, saveCar, removeSavedCar } = useCarContext();
  const { user, setShowLoginModal } = useAuth();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCars, setSelectedCars] = useState<string[]>([]);

  if (!quizResults || !recommendations) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No results found</h2>
          <p className="text-gray-600 mb-6">Please take the quiz first to get recommendations</p>
          <Link
            to="/quiz"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all"
          >
            Take Quiz
          </Link>
        </div>
      </div>
    );
  }

  const handleSaveCar = (carId: string) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    if (savedCars.includes(carId)) {
      removeSavedCar(carId);
    } else {
      saveCar(carId);
    }
  };

  const handleSelectCar = (carId: string) => {
    if (selectedCars.includes(carId)) {
      setSelectedCars(selectedCars.filter(id => id !== carId));
    } else if (selectedCars.length < 3) {
      setSelectedCars([...selectedCars, carId]);
    }
  };

  const handleCompare = () => {
    if (selectedCars.length > 1) {
      navigate(`/compare?cars=${selectedCars.join(',')}`);
    }
  };

  const getMatchReasons = (car: any) => {
    const reasons = [];
    
    if (quizResults.budget && car.priceCategory === quizResults.budget) {
      reasons.push('Fits your budget perfectly');
    }
    
    if (quizResults.vehicleType === car.bodyType.toLowerCase()) {
      reasons.push(`${car.bodyType} matches your preference`);
    }
    
    if (quizResults.fuelType === car.fuelType.toLowerCase() || quizResults.fuelType === 'any') {
      reasons.push(`${car.fuelType} fuel type as preferred`);
    }
    
    if (quizResults.priority?.includes('safety') && car.safetyRating >= 4) {
      reasons.push('High safety rating');
    }
    
    if (quizResults.priority?.includes('economy') && car.mileage >= 15) {
      reasons.push('Excellent fuel economy');
    }
    
    return reasons.slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-16 bg-green-200/20 rounded-full animate-float"></div>
        <div className="absolute top-60 right-20 w-12 h-12 bg-purple-200/20 rounded-full animate-float delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-blue-200/20 rounded-full animate-float delay-500"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4 animate-pulse">
            <CheckCircle className="w-4 h-4 mr-2" />
            Quiz Complete
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Your Personalized Car Recommendations
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
            Based on your preferences, we found {recommendations.length} cars that match your needs. 
            Each recommendation includes a match score and explanation.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0 animate-in fade-in duration-700 delay-600">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            
            {selectedCars.length > 1 && (
              <button
                onClick={handleCompare}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
              >
                <span>Compare ({selectedCars.length})</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            )}
          </div>

          <div className="flex space-x-3">
            <button 
              onClick={() => alert('PDF export feature coming soon!')}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
            <Link
              to="/quiz"
              className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Retake Quiz
            </Link>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 animate-in slide-in-from-top-2 duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Filter Results</h3>
              <button 
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200">
                <option>All Prices</option>
                <option>Under ₹10L</option>
                <option>₹10-20L</option>
                <option>₹20L+</option>
              </select>
              
              <select className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200">
                <option>All Body Types</option>
                <option>Hatchback</option>
                <option>Sedan</option>
                <option>SUV</option>
              </select>
              
              <select className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200">
                <option>All Fuel Types</option>
                <option>Petrol</option>
                <option>Diesel</option>
                <option>Electric</option>
              </select>
              
              <select className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200">
                <option>Sort by Match</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Fuel Economy</option>
              </select>
            </div>
          </div>
        )}

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 animate-in fade-in duration-700 delay-800">
          {recommendations.map((car, index) => {
            const matchReasons = getMatchReasons(car);
            const isSelected = selectedCars.includes(car.id);
            const isSaved = savedCars.includes(car.id);
            
            return (
              <div 
                key={car.id} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-in fade-in duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Match Score Badge */}
                <div className="relative">
                  <img
                    src={car.image}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                      {car.matchScore}% Match
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      onClick={() => handleSelectCar(car.id)}
                      className={`p-2 rounded-full transition-all duration-200 transform hover:scale-110 ${
                        isSelected
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/80 text-gray-600 hover:bg-purple-100'
                      }`}
                    >
                      <Plus className={`w-4 h-4 transition-transform duration-200 ${isSelected ? 'rotate-45' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleSaveCar(car.id)}
                      className={`p-2 rounded-full transition-all duration-200 transform hover:scale-110 ${
                        isSaved
                          ? 'bg-red-500 text-white'
                          : 'bg-white/80 text-gray-600 hover:bg-red-100'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  {index < 3 && (
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-semibold animate-bounce">
                        #{index + 1} Best Match
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {/* Car Info */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {car.make} {car.model}
                      </h3>
                      <p className="text-gray-600">{car.year} • {car.bodyType}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Starting from</p>
                      <p className="text-lg font-bold text-gray-900">₹{car.priceRange.min}L</p>
                    </div>
                  </div>

                  {/* Key Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Mileage</p>
                      <p className="font-semibold">{car.mileage} kmpl</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Fuel</p>
                      <p className="font-semibold">{car.fuelType}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Safety</p>
                      <div className="flex justify-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < car.safetyRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Match Reasons */}
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Why this car?</p>
                    <ul className="space-y-1">
                      {matchReasons.map((reason, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-center">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pros/Cons Preview */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs font-semibold text-green-600 mb-1">PROS</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {car.pros.slice(0, 2).map((pro, idx) => (
                          <li key={idx}>• {pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-red-600 mb-1">CONS</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {car.cons.slice(0, 2).map((con, idx) => (
                          <li key={idx}>• {con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Link
                      to={`/car/${car.id}`}
                      className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg text-center hover:bg-purple-700 transition-all duration-200 transform hover:scale-105"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleSelectCar(car.id)}
                      className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                        isSelected
                          ? 'border-purple-600 text-purple-600 bg-purple-50'
                          : 'border-gray-300 text-gray-600 hover:border-purple-300'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Compare'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {recommendations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No cars match your current filters</p>
            <button
              onClick={() => setShowFilters(true)}
              className="text-purple-600 hover:text-purple-700 transition-colors duration-200"
            >
              Adjust your filters
            </button>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-white rounded-2xl p-8 animate-in fade-in duration-700 delay-1000">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Still not sure which car to choose?
          </h3>
          <p className="text-gray-600 mb-6">
            Compare your top picks side-by-side or get expert advice
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handleCompare}
              disabled={selectedCars.length < 2}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                selectedCars.length >= 2
                  ? 'bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Compare Selected Cars
            </button>
            <button
              onClick={() => alert('Expert consultation feature coming soon!')}
              className="px-6 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-200 transform hover:scale-105"
            >
              Get Expert Advice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;