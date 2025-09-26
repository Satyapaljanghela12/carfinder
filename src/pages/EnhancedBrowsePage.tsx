import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Grid2x2 as Grid, List, ArrowRight, Download } from 'lucide-react';
import { useCarSearch } from '../hooks/useCarApi';
import { useAuth } from '../contexts/AuthContext';
import { useCarContext } from '../contexts/CarContext';
import AdvancedFilters from '../components/CarSearch/AdvancedFilters';
import CarSearchResults from '../components/CarSearch/CarSearchResults';
import RealTimeUpdates from '../components/CarSearch/RealTimeUpdates';
import { CarFilters } from '../services/carApi';

const EnhancedBrowsePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, setShowLoginModal } = useAuth();
  const { savedCars, saveCar, removeSavedCar, quizResults } = useCarContext();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState<CarFilters>({});
  const [selectedCars, setSelectedCars] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('popularity');

  const { data, loading, error, search, loadMore, hasMore } = useCarSearch();

  useEffect(() => {
    // Initialize search with URL parameters
    const initialFilters: CarFilters = {};
    
    if (searchParams.get('minPrice')) {
      initialFilters.budget = {
        min: parseInt(searchParams.get('minPrice')!),
        max: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined
      };
    }
    
    const fuelTypes = searchParams.getAll('fuelType');
    if (fuelTypes.length) initialFilters.fuelType = fuelTypes;
    
    const brands = searchParams.getAll('brand');
    if (brands.length) initialFilters.brand = brands;
    
    const bodyTypes = searchParams.getAll('bodyType');
    if (bodyTypes.length) initialFilters.bodyType = bodyTypes;

    setFilters(initialFilters);
    
    search({
      query: searchQuery,
      ...initialFilters,
      sortBy: sortBy as any,
      page: 1,
      limit: 12
    }, quizResults);
  }, []);

  const handleSearch = () => {
    const searchParams = {
      query: searchQuery,
      ...filters,
      sortBy: sortBy as any,
      page: 1,
      limit: 12
    };
    
    search(searchParams, quizResults);
    updateUrlParams(searchParams);
  };

  const updateUrlParams = (params: any) => {
    const newSearchParams = new URLSearchParams();
    
    if (params.query) newSearchParams.set('q', params.query);
    if (params.budget?.min) newSearchParams.set('minPrice', params.budget.min.toString());
    if (params.budget?.max) newSearchParams.set('maxPrice', params.budget.max.toString());
    
    params.fuelType?.forEach((type: string) => newSearchParams.append('fuelType', type));
    params.brand?.forEach((brand: string) => newSearchParams.append('brand', brand));
    params.bodyType?.forEach((type: string) => newSearchParams.append('bodyType', type));
    
    setSearchParams(newSearchParams);
  };

  const handleFiltersChange = (newFilters: CarFilters) => {
    setFilters(newFilters);
    const searchParams = {
      query: searchQuery,
      ...newFilters,
      sortBy: sortBy as any,
      page: 1,
      limit: 12
    };
    
    search(searchParams, quizResults);
    updateUrlParams(searchParams);
  };

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

  const handleSelectForComparison = (carId: string) => {
    if (selectedCars.includes(carId)) {
      setSelectedCars(selectedCars.filter(id => id !== carId));
    } else if (selectedCars.length < 3) {
      setSelectedCars([...selectedCars, carId]);
    }
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    const searchParams = {
      query: searchQuery,
      ...filters,
      sortBy: newSortBy as any,
      page: 1,
      limit: 12
    };
    
    search(searchParams, quizResults);
  };

  const exportResults = () => {
    // Mock PDF export functionality
    alert('Export functionality will be implemented with a PDF generation service');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {quizResults ? 'Personalized Car Search' : 'Browse Cars'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {data ? `${data.totalCount} cars available` : 'Loading...'}
                  {quizResults && ' • Ranked by your preferences'}
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by make, model, or features..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white px-4 py-1.5 rounded-md hover:bg-purple-700 transition-all"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                {selectedCars.length > 1 && (
                  <Link
                    to={`/compare?cars=${selectedCars.join(',')}`}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 transform hover:scale-105"
                  >
                    <span>Compare ({selectedCars.length})</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
                
                {data && data.cars.length > 0 && (
                  <button
                    onClick={exportResults}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Results</span>
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-4">
                {/* Sort Dropdown */}
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  <option value="popularity">Sort by Popularity</option>
                  <option value="price">Price: Low to High</option>
                  <option value="mileage">Best Mileage</option>
                  <option value="safety">Safety Rating</option>
                  <option value="year">Newest First</option>
                  {quizResults && <option value="match">Best Match</option>}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <AdvancedFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                availableOptions={data?.filters ? {
                  brands: data.filters.availableBrands,
                  fuelTypes: data.filters.availableFuelTypes,
                  bodyTypes: data.filters.availableBodyTypes,
                  transmissions: ['Manual', 'Automatic', 'CVT', 'AMT']
                } : undefined}
              />
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800">Error: {error}</p>
                <button
                  onClick={() => handleSearch()}
                  className="mt-2 text-red-600 hover:text-red-700 font-medium"
                >
                  Try again
                </button>
              </div>
            )}

            <CarSearchResults
              cars={data?.cars || []}
              loading={loading}
              onSaveCar={handleSaveCar}
              onSelectForComparison={handleSelectForComparison}
              savedCars={savedCars}
              selectedCars={selectedCars}
              showMatchScore={!!quizResults}
            />

            {/* Load More */}
            {hasMore && !loading && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-200 transform hover:scale-105"
                >
                  Load More Cars
                </button>
              </div>
            )}

            {/* Pagination Info */}
            {data && (
              <div className="text-center mt-8 text-gray-600">
                <p>
                  Showing {data.cars.length} of {data.totalCount} cars
                  {data.totalPages > 1 && ` • Page ${data.currentPage} of ${data.totalPages}`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Real-time Updates Component */}
      <RealTimeUpdates />
    </div>
  );
};

export default EnhancedBrowsePage;