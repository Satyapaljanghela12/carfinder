import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, X, Star, Fuel, Users, Gauge, Shield } from 'lucide-react';
import { useCarContext } from '../contexts/CarContext';

const ComparePage = () => {
  const [searchParams] = useSearchParams();
  const { getCarById, cars } = useCarContext();
  const [selectedCars, setSelectedCars] = useState<string[]>([]);
  const [showCarSelector, setShowCarSelector] = useState(false);

  useEffect(() => {
    const carIds = searchParams.get('cars');
    if (carIds) {
      setSelectedCars(carIds.split(',').slice(0, 3));
    }
  }, [searchParams]);

  const compareCars = selectedCars.map(id => getCarById(id)).filter(Boolean);
  const availableCars = cars.filter(car => !selectedCars.includes(car.id));

  const addCar = (carId: string) => {
    if (selectedCars.length < 3 && !selectedCars.includes(carId)) {
      setSelectedCars([...selectedCars, carId]);
      setShowCarSelector(false);
    }
  };

  const removeCar = (carId: string) => {
    setSelectedCars(selectedCars.filter(id => id !== carId));
  };

  const specCategories = [
    {
      title: 'Overview',
      specs: [
        { key: 'make', label: 'Brand', format: (car: any) => car.make },
        { key: 'model', label: 'Model', format: (car: any) => car.model },
        { key: 'year', label: 'Year', format: (car: any) => car.year },
        { key: 'bodyType', label: 'Body Type', format: (car: any) => car.bodyType },
        { key: 'priceRange', label: 'Price Range', format: (car: any) => `₹${car.priceRange.min}L - ₹${car.priceRange.max}L` }
      ]
    },
    {
      title: 'Engine & Performance',
      specs: [
        { key: 'engine', label: 'Engine', format: (car: any) => car.specs.engine },
        { key: 'fuelType', label: 'Fuel Type', format: (car: any) => car.fuelType },
        { key: 'transmission', label: 'Transmission', format: (car: any) => car.specs.transmission },
        { key: 'mileage', label: 'Mileage', format: (car: any) => `${car.mileage} kmpl` }
      ]
    },
    {
      title: 'Dimensions & Capacity',
      specs: [
        { key: 'seating', label: 'Seating', format: (car: any) => `${car.specs.seating} Seater` },
        { key: 'bootSpace', label: 'Boot Space', format: (car: any) => `${car.specs.bootSpace}L` },
        { key: 'groundClearance', label: 'Ground Clearance', format: (car: any) => `${car.specs.groundClearance}mm` }
      ]
    },
    {
      title: 'Safety & Ratings',
      specs: [
        { key: 'safetyRating', label: 'Safety Rating', format: (car: any) => `${car.safetyRating}/5 Stars` }
      ]
    }
  ];

  if (compareCars.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Compare Cars</h1>
            <p className="text-gray-600 mb-8">Select cars to compare their features side by side</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[1, 2, 3].map(slot => (
                <div
                  key={slot}
                  className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-purple-400 cursor-pointer transition-all"
                  onClick={() => setShowCarSelector(true)}
                >
                  <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Add Car {slot}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Car Selector Modal */}
        {showCarSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Select a Car</h3>
                <button
                  onClick={() => setShowCarSelector(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableCars.map(car => (
                  <button
                    key={car.id}
                    onClick={() => addCar(car.id)}
                    className="text-left p-4 border rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all"
                  >
                    <img
                      src={car.image}
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h4 className="font-semibold">{car.make} {car.model}</h4>
                    <p className="text-sm text-gray-600">₹{car.priceRange.min}L - ₹{car.priceRange.max}L</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/results"
                className="flex items-center space-x-2 text-gray-600 hover:text-purple-600"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Results</span>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Compare Cars</h1>
            </div>
            
            {selectedCars.length < 3 && (
              <button
                onClick={() => setShowCarSelector(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Plus className="w-4 h-4" />
                <span>Add Car</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Car Headers */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {compareCars.map((car, index) => (
              <div key={car.id} className="text-center relative">
                <button
                  onClick={() => removeCar(car.id)}
                  className="absolute top-2 right-2 p-1 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-full transition-all z-10"
                >
                  <X className="w-4 h-4" />
                </button>
                
                <img
                  src={car.image}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {car.make} {car.model}
                </h3>
                
                <p className="text-gray-600 mb-2">{car.year} • {car.bodyType}</p>
                
                <div className="text-center mb-4">
                  <p className="text-2xl font-bold text-purple-600">
                    ₹{car.priceRange.min}L - ₹{car.priceRange.max}L
                  </p>
                  <p className="text-sm text-gray-500">Ex-showroom price</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-gray-50 p-2 rounded">
                    <Fuel className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                    <p className="font-medium">{car.mileage} kmpl</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <Users className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                    <p className="font-medium">{car.specs.seating} Seater</p>
                  </div>
                </div>

                <div className="mt-4">
                  <Link
                    to={`/car/${car.id}`}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}

            {/* Add Car Slot */}
            {selectedCars.length < 3 && (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 cursor-pointer transition-all flex flex-col items-center justify-center min-h-[300px]"
                onClick={() => setShowCarSelector(true)}
              >
                <Plus className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-600">Add Another Car</p>
              </div>
            )}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="space-y-6">
          {specCategories.map(category => (
            <div key={category.title} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-purple-600 text-white p-4">
                <h2 className="text-xl font-bold">{category.title}</h2>
              </div>
              
              <div className="p-6">
                {category.specs.map(spec => (
                  <div key={spec.key} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-4 border-b border-gray-100 last:border-b-0">
                    <div className="font-medium text-gray-700 flex items-center">
                      {spec.label}
                    </div>
                    
                    {compareCars.map(car => (
                      <div key={`${car.id}-${spec.key}`} className="text-gray-900">
                        {spec.format(car)}
                      </div>
                    ))}
                    
                    {/* Empty slot for add car */}
                    {selectedCars.length < 3 && (
                      <div className="text-gray-400">-</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Pros & Cons Comparison */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mt-6">
          <div className="bg-purple-600 text-white p-4">
            <h2 className="text-xl font-bold">Pros & Cons</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {compareCars.map(car => (
                <div key={car.id}>
                  <h3 className="font-bold text-gray-900 mb-4 text-center">
                    {car.make} {car.model}
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Pros */}
                    <div>
                      <h4 className="text-green-600 font-semibold mb-2 text-sm">PROS</h4>
                      <ul className="space-y-1">
                        {car.pros.slice(0, 3).map((pro, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Cons */}
                    <div>
                      <h4 className="text-red-600 font-semibold mb-2 text-sm">CONS</h4>
                      <ul className="space-y-1">
                        {car.cons.slice(0, 3).map((con, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="text-center mt-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Ready to make a decision?
            </h3>
            <p className="text-gray-600 mb-6">
              Get the best prices and financing options for your chosen cars
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all font-semibold">
                Get Best Quotes
              </button>
              <button className="border border-purple-600 text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition-all font-semibold">
                Save Comparison
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Car Selector Modal */}
      {showCarSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Add a Car to Compare</h3>
              <button
                onClick={() => setShowCarSelector(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableCars.map(car => (
                <button
                  key={car.id}
                  onClick={() => addCar(car.id)}
                  className="text-left p-4 border rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all"
                >
                  <img
                    src={car.image}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h4 className="font-semibold">{car.make} {car.model}</h4>
                  <p className="text-sm text-gray-600 mb-2">₹{car.priceRange.min}L - ₹{car.priceRange.max}L</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{car.fuelType}</span>
                    <span>{car.mileage} kmpl</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparePage;