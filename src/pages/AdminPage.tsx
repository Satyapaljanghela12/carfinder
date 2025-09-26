import React, { useState } from 'react';
import { Upload, Plus, CreditCard as Edit, Trash2, Search, Filter, BarChart3, Users, Car, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCarContext } from '../contexts/CarContext';

const AdminPage = () => {
  const { user } = useAuth();
  const { cars } = useCarContext();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'cars' | 'import' | 'analytics'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCars, setSelectedCars] = useState<string[]>([]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access this page</p>
        </div>
      </div>
    );
  }

  const filteredCars = cars.filter(car =>
    car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const mockStats = {
    totalCars: cars.length,
    totalUsers: 1247,
    activeQuizzes: 43,
    conversionRate: 12.5
  };

  const mockImportHistory = [
    { id: '1', filename: 'cars_update_2024.csv', date: '2024-01-15', records: 150, status: 'Success' },
    { id: '2', filename: 'new_models_jan.json', date: '2024-01-10', records: 25, status: 'Success' },
    { id: '3', filename: 'spec_updates.csv', date: '2024-01-08', records: 75, status: 'Partial' }
  ];

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Mock import logic
      alert(`Import functionality for ${file.name} will be implemented here`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage cars, imports, and analytics</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Car</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'cars', label: 'Manage Cars', icon: <Car className="w-4 h-4" /> },
              { id: 'import', label: 'Import Data', icon: <Upload className="w-4 h-4" /> },
              { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-4 h-4" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-semibold transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-600 hover:text-purple-600'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Cars</p>
                    <p className="text-2xl font-bold text-gray-900">{mockStats.totalCars}</p>
                  </div>
                  <Car className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900">{mockStats.totalUsers}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Quizzes</p>
                    <p className="text-2xl font-bold text-gray-900">{mockStats.activeQuizzes}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Conversion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{mockStats.conversionRate}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-semibold">Car import completed</p>
                    <p className="text-sm text-gray-600">150 new cars added from cars_update_2024.csv</p>
                  </div>
                  <span className="text-sm text-gray-500">2 hours ago</span>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-semibold">New user registration spike</p>
                    <p className="text-sm text-gray-600">43 new users registered in the last hour</p>
                  </div>
                  <span className="text-sm text-gray-500">1 hour ago</span>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-semibold">Quiz completion rate increased</p>
                    <p className="text-sm text-gray-600">75% of users are completing the full quiz</p>
                  </div>
                  <span className="text-sm text-gray-500">3 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cars' && (
          <div>
            {/* Car Management Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search cars by make or model..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
                {selectedCars.length > 0 && (
                  <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    <Trash2 className="w-4 h-4" />
                    <span>Delete ({selectedCars.length})</span>
                  </button>
                )}
              </div>
            </div>

            {/* Cars Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input type="checkbox" className="rounded" />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Car
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price Range
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fuel Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mileage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCars.map((car) => (
                      <tr key={car.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input type="checkbox" className="rounded" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={car.image}
                              alt={`${car.make} ${car.model}`}
                              className="w-12 h-12 rounded-lg object-cover mr-4"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {car.make} {car.model}
                              </div>
                              <div className="text-sm text-gray-500">{car.year} • {car.bodyType}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{car.priceRange.min}L - ₹{car.priceRange.max}L
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {car.fuelType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {car.mileage} kmpl
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-purple-600 hover:text-purple-900">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'import' && (
          <div className="space-y-8">
            {/* Import Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Import Car Data</h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-all">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload CSV or JSON file</h3>
                <p className="text-gray-600 mb-4">Drag and drop your file here, or click to browse</p>
                <input
                  type="file"
                  accept=".csv,.json"
                  onChange={handleImportCSV}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all cursor-pointer inline-block"
                >
                  Choose File
                </label>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">Import Guidelines:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• CSV files should include headers: make, model, year, bodyType, priceMin, priceMax, fuelType, mileage</li>
                  <li>• Maximum file size: 10MB</li>
                  <li>• Duplicate entries will be automatically detected and skipped</li>
                  <li>• Images should be provided as URLs</li>
                </ul>
              </div>
            </div>

            {/* Import History */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Import History</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Filename
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Records
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockImportHistory.map((import_) => (
                      <tr key={import_.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {import_.filename}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {import_.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {import_.records}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            import_.status === 'Success' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {import_.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Analytics Dashboard</h2>
            <div className="text-center py-12 text-gray-500">
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p>Advanced analytics dashboard coming soon...</p>
              <p className="text-sm mt-2">Track user behavior, popular searches, and conversion metrics</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;