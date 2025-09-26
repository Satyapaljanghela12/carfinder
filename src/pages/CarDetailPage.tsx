import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, Star, Fuel, Users, Gauge, Shield, Download, Plus } from 'lucide-react';
import { useCarContext } from '../contexts/CarContext';
import { useAuth } from '../contexts/AuthContext';

const CarDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCarById, savedCars, saveCar, removeSavedCar } = useCarContext();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'reviews' | 'ownership'>('overview');

  const car = id ? getCarById(id) : null;

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Car not found</h2>
          <Link to="/browse" className="text-purple-600 hover:text-purple-700">
            ← Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  const isSaved = savedCars.includes(car.id);

  const handleSaveCar = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (isSaved) {
      removeSavedCar(car.id);
    } else {
      saveCar(car.id);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${car.make} ${car.model}`,
          text: `Check out this ${car.make} ${car.model} on CarMatch`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const keySpecs = [
    { icon: <Fuel className="w-5 h-5" />, label: 'Fuel Type', value: car.fuelType },
    { icon: <Gauge className="w-5 h-5" />, label: 'Mileage', value: `${car.mileage} kmpl` },
    { icon: <Users className="w-5 h-5" />, label: 'Seating', value: `${car.specs.seating} Seater` },
    { icon: <Shield className="w-5 h-5" />, label: 'Safety', value: `${car.safetyRating}/5 Stars` },
  ];

  const ownershipCosts = {
    insurance: '₹25,000 - ₹40,000/year',
    maintenance: '₹15,000 - ₹30,000/year',
    fuelCost: '₹8 - ₹12/km',
    resaleValue: '65-75% after 3 years'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-purple-600"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleShare}
                className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={handleSaveCar}
                className={`p-2 rounded-lg transition-all ${
                  isSaved
                    ? 'text-red-500 bg-red-50 hover:bg-red-100'
                    : 'text-gray-600 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all">
                Get Quote
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image */}
            <div className="relative">
              <img
                src={car.image}
                alt={`${car.make} ${car.model}`}
                className="w-full h-96 object-cover rounded-2xl"
              />
              {car.matchScore && (
                <div className="absolute top-4 left-4">
                  <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {car.matchScore}% Match
                  </div>
                </div>
              )}
            </div>

            {/* Car Info */}
            <div>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    {car.make} {car.model}
                  </h1>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < car.safetyRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-gray-600">(4.5)</span>
                  </div>
                </div>
                <p className="text-gray-600 text-lg">{car.year} • {car.bodyType}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{car.priceRange.min}L
                  </span>
                  <span className="text-gray-600">- ₹{car.priceRange.max}L</span>
                </div>
                <p className="text-gray-500">Ex-showroom price</p>
              </div>

              {/* Key Specs */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {keySpecs.map((spec, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <div className="text-purple-600">
                      {spec.icon}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{spec.label}</p>
                      <p className="font-semibold text-gray-900">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all font-semibold">
                  Get Best Price
                </button>
                <Link
                  to={`/compare?cars=${car.id}`}
                  className="px-6 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-all font-semibold flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Compare</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'specs', label: 'Specifications' },
              { id: 'reviews', label: 'Reviews' },
              { id: 'ownership', label: 'Ownership Cost' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-2 border-b-2 font-semibold transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-600 hover:text-purple-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pros */}
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-green-600 mb-4 flex items-center">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  Pros
                </h3>
                <ul className="space-y-3">
                  {car.pros.map((pro, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  </div>
                  Cons
                </h3>
                <ul className="space-y-3">
                  {car.cons.map((con, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Detailed Specifications</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Engine & Performance</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Engine</span>
                        <span className="font-medium">{car.specs.engine}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Transmission</span>
                        <span className="font-medium">{car.specs.transmission}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Fuel Type</span>
                        <span className="font-medium">{car.fuelType}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Mileage</span>
                        <span className="font-medium">{car.mileage} kmpl</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Dimensions & Capacity</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Seating Capacity</span>
                        <span className="font-medium">{car.specs.seating} Seater</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Boot Space</span>
                        <span className="font-medium">{car.specs.bootSpace}L</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Ground Clearance</span>
                        <span className="font-medium">{car.specs.groundClearance}mm</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Body Type</span>
                        <span className="font-medium">{car.bodyType}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">User Reviews</h3>
              <div className="text-center py-12 text-gray-500">
                <p>Reviews feature coming soon...</p>
                <p className="text-sm mt-2">Be the first to review this car!</p>
              </div>
            </div>
          )}

          {activeTab === 'ownership' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Ownership Cost</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Annual Costs</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Insurance</span>
                      <span className="font-semibold text-gray-900">{ownershipCosts.insurance}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Maintenance</span>
                      <span className="font-semibold text-gray-900">{ownershipCosts.maintenance}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Fuel Cost (per km)</span>
                      <span className="font-semibold text-gray-900">{ownershipCosts.fuelCost}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Resale Value</h4>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-gray-700 mb-2">Expected resale value:</p>
                    <p className="text-xl font-bold text-purple-600">{ownershipCosts.resaleValue}</p>
                  </div>
                  
                  <button className="w-full mt-4 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all font-semibold flex items-center justify-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Download Cost Calculator</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Cars */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Similar Cars</h2>
          <div className="text-center py-8 text-gray-500">
            <p>Similar cars recommendations coming soon...</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CarDetailPage;