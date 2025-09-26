import React, { useState } from 'react';
import { Bell, X, Clock, Car, TrendingUp, AlertCircle } from 'lucide-react';
import { useRealTimeUpdates } from '../../hooks/useCarApi';

const RealTimeUpdates: React.FC = () => {
  const { updates, connected, clearUpdates } = useRealTimeUpdates();
  const [isVisible, setIsVisible] = useState(true);
  const [expandedUpdate, setExpandedUpdate] = useState<string | null>(null);

  if (!isVisible || updates.length === 0) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className={`p-3 rounded-full shadow-lg transition-all ${
            connected ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500'
          } text-white`}
        >
          <Bell className="w-5 h-5" />
          {updates.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {updates.length > 9 ? '9+' : updates.length}
            </span>
          )}
        </button>
      </div>
    );
  }

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'car_added':
        return <Car className="w-4 h-4 text-green-600" />;
      case 'car_updated':
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'price_change':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getUpdateMessage = (update: any) => {
    switch (update.type) {
      case 'car_added':
        return `New ${update.make} ${update.model} added to inventory`;
      case 'car_updated':
        return `${update.make} ${update.model} details updated`;
      case 'price_change':
        return `Price ${update.priceChange > 0 ? 'increased' : 'decreased'} for ${update.make} ${update.model}`;
      case 'availability_change':
        return `${update.make} ${update.model} availability updated`;
      default:
        return update.message || 'New update available';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 max-h-96 bg-white rounded-lg shadow-xl border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <h3 className="font-semibold text-gray-900">Live Updates</h3>
            <span className="text-xs text-gray-500">({updates.length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={clearUpdates}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Updates List */}
      <div className="max-h-80 overflow-y-auto">
        {updates.slice(0, 10).map((update, index) => (
          <div
            key={`${update.timestamp}-${index}`}
            className="p-3 border-b hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => setExpandedUpdate(
              expandedUpdate === update.id ? null : update.id
            )}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {getUpdateIcon(update.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 font-medium">
                  {getUpdateMessage(update)}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {formatTime(update.timestamp)}
                  </span>
                </div>
                
                {/* Expanded Details */}
                {expandedUpdate === update.id && update.details && (
                  <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
                    {update.type === 'price_change' && (
                      <div>
                        <p>Previous: ₹{update.details.oldPrice}L</p>
                        <p>Current: ₹{update.details.newPrice}L</p>
                        <p className={`font-semibold ${
                          update.details.newPrice > update.details.oldPrice 
                            ? 'text-red-600' 
                            : 'text-green-600'
                        }`}>
                          {update.details.newPrice > update.details.oldPrice ? '+' : ''}
                          ₹{(update.details.newPrice - update.details.oldPrice).toFixed(1)}L
                        </p>
                      </div>
                    )}
                    {update.type === 'car_added' && (
                      <div>
                        <p>Price: ₹{update.details.price}L</p>
                        <p>Fuel: {update.details.fuelType}</p>
                        <p>Mileage: {update.details.mileage} kmpl</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {updates.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm">No updates yet</p>
            <p className="text-xs">You'll see real-time car updates here</p>
          </div>
        )}
      </div>

      {/* Connection Status */}
      <div className="p-2 bg-gray-50 border-t">
        <div className="flex items-center justify-center space-x-2 text-xs">
          <div className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-gray-600">
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RealTimeUpdates;