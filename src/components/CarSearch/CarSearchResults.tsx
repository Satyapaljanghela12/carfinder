import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, Plus, MapPin, Fuel, Users, Gauge, Shield, TrendingUp, Clock } from 'lucide-react';
import { CarDetail } from '../../services/carApi';
import { useAuth } from '../../contexts/AuthContext';

interface CarSearchResultsProps {
  cars: CarDetail[];
  loading: boolean;
  onSaveCar: (carId: string) => void;
  onSelectForComparison: (carId: string) => void;
  savedCars: string[];
  selectedCars: string[];
  showMatchScore?: boolean;
}

const CarSearchResults: React.FC<CarSearchResultsProps> = ({
  cars,
  loading,
  onSaveCar,
  onSelectForComparison,
  savedCars,
  selectedCars,
  showMatchScore = false
}) => {
  const { user, setShowLoginModal } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleSaveCar = (carId: string) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    onSaveCar(carId);
  };

  const formatPrice = (price: number) => {
    return `₹${price}L`;
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
            <div className="flex space-x-4">
              <div className="w-48 h-32 bg-gray-300 rounded-lg"></div>
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No cars found</h3>
        <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {cars.map((car, index) => {
        const isSaved = savedCars.includes(car.id);
        const isSelected = selectedCars.includes(car.id);
        const isNewListing = car.lastUpdated && 
          new Date(car.lastUpdated) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        return (
          <div 
            key={car.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6">
                {/* Car Image */}
                <div className="relative lg:w-64 flex-shrink-0">
                  <img
                    src={car.images[0] || car.image}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-48 lg:h-40 object-cover rounded-lg"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col space-y-1">
                    {showMatchScore && car.matchScore && (
                      <div className={`bg-gradient-to-r ${getMatchScoreColor(car.matchScore)} text-white px-2 py-1 rounded-full text-xs font-bold`}>
                        {car.matchScore}% Match
                      </div>
                    )}
                    {isNewListing && (
                      <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>New</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button
                      onClick={() => onSelectForComparison(car.id)}
                      className={`p-2 rounded-full transition-all ${
                        isSelected
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/80 text-gray-600 hover:bg-purple-100'
                      }`}
                      title="Add to comparison"
                    >
                      <Plus className={`w-4 h-4 ${isSelected ? 'rotate-45' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleSaveCar(car.id)}
                      className={`p-2 rounded-full transition-all ${
                        isSaved
                          ? 'bg-red-500 text-white'
                          : 'bg-white/80 text-gray-600 hover:bg-red-100'
                      }`}
                      title="Save to favorites"
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Car Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {car.make} {car.model}
                      </h3>
                      <p className="text-gray-600">{car.year} • {car.bodyType}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {formatPrice(car.priceRange.min)}
                      </p>
                      <p className="text-sm text-gray-500">onwards</p>
                    </div>
                  </div>

                  {/* Key Specifications */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Fuel className="w-4 h-4 text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-500">Mileage</p>
                        <p className="text-sm font-semibold">{car.mileage} kmpl</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Gauge className="w-4 h-4 text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-500">Fuel</p>
                        <p className="text-sm font-semibold">{car.fuelType}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-500">Seating</p>
                        <p className="text-sm font-semibold">{car.specs.seating}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-500">Safety</p>
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-sm font-semibold ml-1">{car.safetyRating}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Match Reasons */}
                  {showMatchScore && car.compatibilityReasons && car.compatibilityReasons.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Why this matches:</p>
                      <div className="flex flex-wrap gap-1">
                        {car.compatibilityReasons.slice(0, 3).map((reason, idx) => (
                          <span
                            key={idx}
                            className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
                          >
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dealer Availability */}
                  {car.dealers && car.dealers.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>Available at {car.dealers.length} dealers nearby</span>
                        {car.dealers.some(d => d.availability) && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            In Stock
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Key Features Preview */}
                  <div className="mb-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-green-600 mb-1">TOP FEATURES</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {car.features.safety.slice(0, 2).map((feature, idx) => (
                            <li key={idx}>• {feature}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-blue-600 mb-1">VARIANTS</p>
                        <p className="text-xs text-gray-600">
                          {car.variants?.length || 1} variant{(car.variants?.length || 1) > 1 ? 's' : ''} available
                        </p>
                        <p className="text-xs text-gray-600">
                          {car.colors?.length || 1} color{(car.colors?.length || 1) > 1 ? 's' : ''} available
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <Link
                      to={`/car/${car.id}`}
                      className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg text-center hover:bg-purple-700 transition-all duration-200 transform hover:scale-105"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => onSelectForComparison(car.id)}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        isSelected
                          ? 'border-purple-600 text-purple-600 bg-purple-50'
                          : 'border-gray-300 text-gray-600 hover:border-purple-300'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Compare'}
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all">
                      Get Quote
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CarSearchResults;