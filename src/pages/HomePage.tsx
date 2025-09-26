import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Zap, Users, TrendingUp, Search, Sparkles, Award, Clock } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "AI-Powered Recommendations",
      description: "Get personalized car suggestions based on your unique preferences and lifestyle"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Trusted Data",
      description: "Real-world specs, safety ratings, and ownership costs from verified sources"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Expert Insights",
      description: "Detailed pros, cons, and expert reviews for every vehicle"
    }
  ];

  const trendingCars = [
    { name: "Toyota Camry", price: "₹28-35L", category: "Sedan", image: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=300" },
    { name: "Honda CR-V", price: "₹32-38L", category: "SUV", image: "https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=300" },
    { name: "Maruti Swift", price: "₹6-9L", category: "Hatchback", image: "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=300" },
    { name: "Mahindra XUV700", price: "₹14-25L", category: "SUV", image: "https://images.pexels.com/photos/1119796/pexels-photo-1119796.jpeg?auto=compress&cs=tinysrgb&w=300" }
  ];

  const carBrands = [
    "Toyota", "Honda", "Maruti Suzuki", "Hyundai", "Tata", "Mahindra", "Ford", "Volkswagen"
  ];

  const stats = [
    { icon: <Car className="w-6 h-6" />, number: "500+", label: "Cars Available" },
    { icon: <Users className="w-6 h-6" />, number: "50K+", label: "Happy Customers" },
    { icon: <Award className="w-6 h-6" />, number: "98%", label: "Satisfaction Rate" },
    { icon: <Clock className="w-6 h-6" />, number: "5 Min", label: "Quick Quiz" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce delay-1000"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-yellow-400/20 rounded-full animate-pulse delay-500"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-bounce delay-700"></div>
          <div className="absolute bottom-40 right-1/3 w-8 h-8 bg-purple-300/30 rounded-full animate-pulse delay-300"></div>
        </div>
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 animate-in fade-in slide-in-from-top-4 duration-1000">
              <Sparkles className="w-4 h-4 mr-2 text-yellow-300" />
              <span className="text-sm font-medium">India's #1 Car Recommendation Platform</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
              Find your next
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 animate-pulse">
                awesome vehicle
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-400">
              Get personalized car recommendations in just 5 minutes. Our AI analyzes your needs to find the perfect match.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-600">
              <Link
                to="/quiz"
                className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center space-x-2 shadow-lg transform hover:scale-105 hover:shadow-xl group"
              >
                <span>Take the Quiz</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link
                to="/browse"
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 group"
              >
                <Search className="w-5 h-5" />
                <span>Browse Catalog</span>
              </Link>
            </div>

            {/* Quick Search */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-800 hover:bg-white/15 transition-all duration-300">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select className="bg-white/90 text-gray-900 px-4 py-3 rounded-lg hover:bg-white transition-all duration-200 focus:ring-2 focus:ring-yellow-400 focus:outline-none">
                  <option>Budget Range</option>
                  <option>Under ₹5L</option>
                  <option>₹5-10L</option>
                  <option>₹10-20L</option>
                  <option>₹20L+</option>
                </select>
                <select className="bg-white/90 text-gray-900 px-4 py-3 rounded-lg hover:bg-white transition-all duration-200 focus:ring-2 focus:ring-yellow-400 focus:outline-none">
                  <option>Vehicle Type</option>
                  <option>Hatchback</option>
                  <option>Sedan</option>
                  <option>SUV</option>
                  <option>Pickup</option>
                </select>
                <select className="bg-white/90 text-gray-900 px-4 py-3 rounded-lg hover:bg-white transition-all duration-200 focus:ring-2 focus:ring-yellow-400 focus:outline-none">
                  <option>Fuel Type</option>
                  <option>Petrol</option>
                  <option>Diesel</option>
                  <option>Electric</option>
                  <option>Hybrid</option>
                </select>
                <Link
                  to="/browse"
                  className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-all duration-200 transform hover:scale-105 hover:shadow-lg text-center"
                >
                  Search
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200">
                  {React.cloneElement(stat.icon, { className: "w-6 h-6 text-white" })}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Car Brands */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Trusted by leading brands</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center opacity-60">
            {carBrands.map((brand, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-2 flex items-center justify-center group-hover:bg-purple-100 group-hover:scale-110 transition-all duration-200">
                  <span className="text-xs font-semibold text-gray-600">{brand.slice(0, 3).toUpperCase()}</span>
                </div>
                <p className="text-sm text-gray-500 group-hover:text-purple-600 transition-colors duration-200">{brand}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose CarMatch?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We use advanced algorithms and real-world data to help you make the best car buying decision
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  {React.cloneElement(feature.icon, { className: "w-6 h-6 text-white" })}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-200">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Cars */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Trending near you</h2>
              <p className="text-gray-600">Popular cars in your area based on recent searches</p>
            </div>
            <Link to="/browse" className="text-purple-600 hover:text-purple-700 flex items-center space-x-1 group">
              <span>View all</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingCars.map((car, index) => (
              <Link key={index} to="/browse" className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer block hover:-translate-y-2">
                <div className="aspect-w-16 aspect-h-10 overflow-hidden">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-200">{car.name}</h3>
                    <span className="text-sm text-purple-600 bg-purple-50 px-2 py-1 rounded">{car.category}</span>
                  </div>
                  <p className="text-gray-600 mb-3">Starting from</p>
                  <p className="text-xl font-bold text-gray-900">{car.price}</p>
                  <div className="flex items-center mt-3 space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                    <span className="text-sm text-gray-500 ml-2">(4.5)</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-yellow-400/10 rounded-full animate-bounce delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full animate-pulse delay-500"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to find your perfect car?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Take our smart quiz and get personalized recommendations in just 5 minutes
          </p>
          <Link
            to="/quiz"
            className="inline-flex items-center bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg transform hover:scale-105 hover:shadow-xl group"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            Start Quiz Now
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;