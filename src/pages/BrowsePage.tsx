import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Grid2x2 as Grid, List, Star, Heart, Plus } from 'lucide-react';
import { useCarContext } from '../contexts/CarContext';
import { useAuth } from '../contexts/AuthContext';

const BrowsePage = () => {
  const { cars, savedCars, saveCar, removeSavedCar, searchCars } = useCarContext();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    bodyType: '',
    fuelType: '',
    minPrice: '',
    maxPrice: '',
    minSeats: '',
    sortBy: 'popularity'
  });
  const [selectedCars, setSelectedCars] = useState<string[]>([]);

  // Apply filters and search
  const filteredCars = cars.filter(car => {
    // Search term
    if (searchTerm && !car.make.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !car.model.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Body type filter
    if (filters.bodyType && car.bodyType.toLowerCase() !== filters.bodyType.toLowerCase()) {
      return false;
    }

    // Fuel type filter
    if (filters.fuelType && car.fuelType.toLowerCase() !== filters.fuelType.toLowerCase()) {
      return false;
    }

    // Price range filters
    if (filters.minPrice && car.priceRange.min < parseInt(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && car.priceRange.max > parseInt(filters.maxPrice)) {
      return false;
    }

    // Seating filter
    if (filters.minSeats && car.specs.seating < parseInt(filters.minSeats)) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'priceAsc':
        return a.priceRange.min - b.priceRange.min;
      case 'priceDesc':
        return b.priceRange.max - a.priceRange.max;
      case 'mileage':
        return b.mileage - a.mileage;
      case 'safety':
        return b.safetyRating - a.safetyRating;
      default:
        return 0; // popularity - keep original order
    }
  });

  const handleSaveCar = (carId: string) => {
    if (!user) {
      // Handle login redirect
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

  const resetFilters = () => {
    setFilters({
      bodyType: '',
      fuelType: '',
      minPrice: '',
      maxPrice: '',
      minSeats: '',
      sortBy: 'popularity'
    });
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Browse Cars</h1>
              <p className="text-gray-600 mt-1">{filteredCars.length} cars available</p>
            </div>

            {/* Search Bar */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by make or model..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {Object.values(filters).some(v => v && v !== 'popularity') && (
                  <span className="bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    !
                  </span>
                )}
              </button>

              {selectedCars.length > 1 && (
                <Link
                  to={`/compare?cars=${selectedCars.join(',')}`}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                >
                  <span>Compare ({selectedCars.length})</span>
                </Link>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Sort */}
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                value={filters.sortBy}
                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
              >
                <option value="popularity">Sort by Popularity</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="mileage">Best Mileage</option>
                <option value="safety">Safety Rating</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <select
                className="border border-gray-300 rounded-lg px-3 py-2"
                value={filters.bodyType}
                onChange={(e) => setFilters({...filters, bodyType: e.target.value})}
              >
                <option value="">All Body Types</option>
                <option value="hatchback">Hatchback</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="pickup">Pickup</option>
              </select>

              <select
                className="border border-gray-300 rounded-lg px-3 py-2"
                value={filters.fuelType}
                onChange={(e) => setFilters({...filters, fuelType: e.target.value})}
              >
                <option value="">All Fuel Types</option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
              </select>

              <input
                type="number"
                placeholder="Min Price (₹L)"
                className="border border-gray-300 rounded-lg px-3 py-2"
                value={filters.minPrice}
                onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
              />

              <input
                type="number"
                placeholder="Max Price (₹L)"
                className="border border-gray-300 rounded-lg px-3 py-2"
                value={filters.maxPrice}
                onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
              />

              <select
                className="border border-gray-300 rounded-lg px-3 py-2"
                value={filters.minSeats}
                onChange={(e) => setFilters({...filters, minSeats: e.target.value})}
              >
                <option value="">Any Seating</option>
                <option value="2">2+ Seater</option>
                <option value="5">5+ Seater</option>
                <option value="7">7+ Seater</option>
              </select>

              <button
                onClick={resetFilters}
                className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cars Grid/List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredCars.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No cars found matching your criteria</p>
            <button
              onClick={resetFilters}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Clear filters to see all cars
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => {
              const isSaved = savedCars.includes(car.id);
              const isSelected = selectedCars.includes(car.id);

              return (
                <div key={car.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                  <div className="relative">
                    <img
                      src={car.image}
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <button
                        onClick={() => handleSelectCar(car.id)}
                        className={`p-2 rounded-full transition-all ${
                          isSelected
                            ? 'bg-purple-600 text-white'
                            : 'bg-white/80 text-gray-600 hover:bg-purple-100'
                        }`}
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
                      >
                        <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {car.make} {car.model}
                        </h3>
                        <p className="text-gray-600">{car.year} • {car.bodyType}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">₹{car.priceRange.min}L</p>
                        <p className="text-sm text-gray-500">onwards</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                      <div>
                        <p className="text-sm text-gray-500">Mileage</p>
                        <p className="font-semibold">{car.mileage} kmpl</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Fuel</p>
                        <p className="font-semibold">{car.fuelType}</p>
                      </div>
                      <div>
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

                    <div className="flex space-x-2">
                      <Link
                        to={`/car/${car.id}`}
                        className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg text-center hover:bg-purple-700 transition-all"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handleSelectCar(car.id)}
                        className={`px-4 py-2 rounded-lg border transition-all ${
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
        ) : (
          <div className="space-y-4">
            {filteredCars.map((car) => {
              const isSaved = savedCars.includes(car.id);
              const isSelected = selectedCars.includes(car.id);

              return (
                <div key={car.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                    <div className="relative">
                      <img
                        src={car.image}
                        alt={`${car.make} ${car.model}`}
                        className="w-full h-32 md:h-24 object-cover rounded-lg"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {car.make} {car.model}
                      </h3>
                      <p className="text-gray-600 mb-2">{car.year} • {car.bodyType}</p>
                      
                      <div className="flex space-x-6 text-sm text-gray-600">
                        <span>{car.mileage} kmpl</span>
                        <span>{car.fuelType}</span>
                        <span>{car.specs.seating} Seater</span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span>{car.safetyRating}/5</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-3">
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          ₹{car.priceRange.min}L - ₹{car.priceRange.max}L
                        </p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Link
                          to={`/car/${car.id}`}
                          className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg text-center hover:bg-purple-700 transition-all text-sm"
                        >
                          Details
                        </Link>
                        <button
                          onClick={() => handleSelectCar(car.id)}
                          className={`p-2 rounded-lg border transition-all ${
                            isSelected
                              ? 'border-purple-600 text-purple-600 bg-purple-50'
                              : 'border-gray-300 text-gray-600 hover:border-purple-300'
                          }`}
                        >
                          <Plus className={`w-4 h-4 ${isSelected ? 'rotate-45' : ''}`} />
                        </button>
                        <button
                          onClick={() => handleSaveCar(car.id)}
                          className={`p-2 rounded-lg border transition-all ${
                            isSaved
                              ? 'border-red-500 text-red-500 bg-red-50'
                              : 'border-gray-300 text-gray-600 hover:border-red-300'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowsePage;