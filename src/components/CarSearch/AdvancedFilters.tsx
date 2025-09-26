import React, { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { CarFilters } from '../../services/carApi';

interface AdvancedFiltersProps {
  filters: CarFilters;
  onFiltersChange: (filters: CarFilters) => void;
  availableOptions?: {
    brands: string[];
    fuelTypes: string[];
    bodyTypes: string[];
    transmissions: string[];
  };
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFiltersChange,
  availableOptions = {
    brands: ['Toyota', 'Honda', 'Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Ford', 'Volkswagen'],
    fuelTypes: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'],
    bodyTypes: ['Hatchback', 'Sedan', 'SUV', 'Pickup', 'Convertible', 'Coupe'],
    transmissions: ['Manual', 'Automatic', 'CVT', 'AMT']
  }
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const updateFilter = (key: keyof CarFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: keyof CarFilters, value: string) => {
    const currentArray = (filters[key] as string[]) || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    updateFilter(key, newArray.length > 0 ? newArray : undefined);
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      value !== undefined && 
      (Array.isArray(value) ? value.length > 0 : true)
    ).length;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="bg-white rounded-lg shadow-lg border">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span className="font-medium">Advanced Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-red-600 hover:text-red-700 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Filters Content */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Price Range */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Price Range (₹ Lakh)</h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Min"
                className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={filters.budget?.min || ''}
                onChange={(e) => updateFilter('budget', {
                  ...filters.budget,
                  min: e.target.value ? parseInt(e.target.value) : undefined
                })}
              />
              <input
                type="number"
                placeholder="Max"
                className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={filters.budget?.max || ''}
                onChange={(e) => updateFilter('budget', {
                  ...filters.budget,
                  max: e.target.value ? parseInt(e.target.value) : undefined
                })}
              />
            </div>
          </div>

          {/* Brand Selection */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Brand</h3>
            <div className="grid grid-cols-2 gap-2">
              {availableOptions.brands.map(brand => (
                <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(filters.brand || []).includes(brand)}
                    onChange={() => toggleArrayFilter('brand', brand)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Fuel Type */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Fuel Type</h3>
            <div className="flex flex-wrap gap-2">
              {availableOptions.fuelTypes.map(fuelType => (
                <button
                  key={fuelType}
                  onClick={() => toggleArrayFilter('fuelType', fuelType)}
                  className={`px-3 py-1 rounded-full text-sm border transition-all ${
                    (filters.fuelType || []).includes(fuelType)
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300'
                  }`}
                >
                  {fuelType}
                </button>
              ))}
            </div>
          </div>

          {/* Body Type */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Body Type</h3>
            <div className="flex flex-wrap gap-2">
              {availableOptions.bodyTypes.map(bodyType => (
                <button
                  key={bodyType}
                  onClick={() => toggleArrayFilter('bodyType', bodyType)}
                  className={`px-3 py-1 rounded-full text-sm border transition-all ${
                    (filters.bodyType || []).includes(bodyType)
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300'
                  }`}
                >
                  {bodyType}
                </button>
              ))}
            </div>
          </div>

          {/* Seating Capacity */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Seating Capacity</h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Min seats"
                className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={filters.seating?.min || ''}
                onChange={(e) => updateFilter('seating', {
                  ...filters.seating,
                  min: e.target.value ? parseInt(e.target.value) : undefined
                })}
              />
              <input
                type="number"
                placeholder="Max seats"
                className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={filters.seating?.max || ''}
                onChange={(e) => updateFilter('seating', {
                  ...filters.seating,
                  max: e.target.value ? parseInt(e.target.value) : undefined
                })}
              />
            </div>
          </div>

          {/* Mileage */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Minimum Mileage (kmpl)</h3>
            <input
              type="number"
              placeholder="e.g., 15"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={filters.mileage?.min || ''}
              onChange={(e) => updateFilter('mileage', {
                min: e.target.value ? parseInt(e.target.value) : undefined
              })}
            />
          </div>

          {/* Safety Rating */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Minimum Safety Rating</h3>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  onClick={() => updateFilter('safetyRating', { min: rating })}
                  className={`px-3 py-1 rounded border text-sm transition-all ${
                    filters.safetyRating?.min === rating
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300'
                  }`}
                >
                  {rating}+ ⭐
                </button>
              ))}
            </div>
          </div>

          {/* Transmission */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Transmission</h3>
            <div className="flex flex-wrap gap-2">
              {availableOptions.transmissions.map(transmission => (
                <button
                  key={transmission}
                  onClick={() => toggleArrayFilter('transmission', transmission)}
                  className={`px-3 py-1 rounded-full text-sm border transition-all ${
                    (filters.transmission || []).includes(transmission)
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300'
                  }`}
                >
                  {transmission}
                </button>
              ))}
            </div>
          </div>

          {/* Year Range */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Year Range</h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="From year"
                className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={filters.year?.min || ''}
                onChange={(e) => updateFilter('year', {
                  ...filters.year,
                  min: e.target.value ? parseInt(e.target.value) : undefined
                })}
              />
              <input
                type="number"
                placeholder="To year"
                className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={filters.year?.max || ''}
                onChange={(e) => updateFilter('year', {
                  ...filters.year,
                  max: e.target.value ? parseInt(e.target.value) : undefined
                })}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;