import React, { createContext, useContext, useState, useEffect } from 'react';
import { carApiService, CarDetail as ApiCarDetail, CarSearchParams } from '../services/carApi';

// Keep the existing Car interface for backward compatibility
interface Car extends ApiCarDetail {
  // Legacy fields that might be used in existing components
}

// Use the API CarDetail type as the primary interface
interface CarDetail extends ApiCarDetail {
  id: string;
  make: string;
  model: string;
  year: number;
  bodyType: string;
  priceRange: { min: number; max: number };
  fuelType: string;
  mileage: number;
  safetyRating: number;
  image: string;
  pros: string[];
  cons: string[];
  specs: {
    engine: string;
    transmission: string;
    seating: number;
    bootSpace: number;
    groundClearance: number;
  };
  matchScore?: number;
  priceCategory?: string;
  lastUpdated?: string;
}

interface QuizAnswer {
  budget: string;
  vehicleType: string;
  seating: string;
  fuelType: string;
  commute: string;
  usage: string;
  priority: string[];
  experience: string;
}

interface CarContextType {
  cars: CarDetail[];
  recommendations: CarDetail[];
  savedCars: string[];
  quizResults: QuizAnswer | null;
  setQuizResults: (results: QuizAnswer) => void;
  saveCar: (carId: string) => void;
  removeSavedCar: (carId: string) => void;
  getCarById: (id: string) => CarDetail | undefined;
  searchCars: (filters: any) => CarDetail[];
  // New API-powered methods
  searchCarsAdvanced: (params: CarSearchParams) => Promise<void>;
  isLoading: boolean;
  searchError: string | null;
}

const CarContext = createContext<CarContextType | undefined>(undefined);

export const useCarContext = () => {
  const context = useContext(CarContext);
  if (!context) {
    throw new Error('useCarContext must be used within a CarProvider');
  }
  return context;
};

// Mock car data
const mockCars: CarDetail[] = [
  {
    id: '1',
    make: 'Maruti Suzuki',
    model: 'Swift',
    year: 2024,
    bodyType: 'Hatchback',
    priceRange: { min: 6, max: 9 },
    fuelType: 'Petrol',
    mileage: 22.5,
    safetyRating: 4,
    image: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=500',
    pros: ['Excellent fuel economy', 'Reliable brand', 'Easy maintenance', 'Good resale value'],
    cons: ['Limited rear space', 'Basic interior', 'Road noise at high speeds'],
    specs: {
      engine: '1.2L Petrol',
      transmission: 'Manual/AMT',
      seating: 5,
      bootSpace: 268,
      groundClearance: 163,
      fuelTankCapacity: 37,
      dimensions: {
        length: 3845,
        width: 1735,
        height: 1530,
        wheelbase: 2450
      }
    },
    features: {
      safety: ['Dual Airbags', 'ABS with EBD', 'Reverse Parking Sensors'],
      comfort: ['AC', 'Power Steering', 'Central Locking'],
      technology: ['Touchscreen Infotainment', 'Bluetooth', 'USB Connectivity'],
      exterior: ['Alloy Wheels', 'Body Colored Bumpers', 'Fog Lamps'],
      interior: ['Fabric Seats', 'Tilt Steering', 'Digital Cluster']
    },
    images: ['https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=500'],
    colors: ['Pearl White', 'Metallic Silver', 'Granite Grey', 'Pearl Red'],
    variants: [
      {
        id: '1-lxi',
        name: 'LXI',
        price: 6.0,
        features: ['Basic features'],
        engine: '1.2L Petrol',
        transmission: 'Manual',
        fuelType: 'Petrol',
        mileage: 22.5
      }
    ],
    dealers: [],
    lastUpdated: new Date().toISOString()
  },
  {
    id: '2',
    make: 'Toyota',
    model: 'Camry',
    year: 2024,
    bodyType: 'Sedan',
    priceRange: { min: 28, max: 35 },
    fuelType: 'Hybrid',
    mileage: 19.1,
    safetyRating: 5,
    image: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=500',
    pros: ['Hybrid technology', 'Spacious interior', 'Premium features', 'Strong safety rating'],
    cons: ['Higher price point', 'Limited service network', 'Premium fuel required'],
    specs: {
      engine: '2.5L Hybrid',
      transmission: 'CVT',
      seating: 5,
      bootSpace: 524,
      groundClearance: 170,
      fuelTankCapacity: 60,
      dimensions: {
        length: 4885,
        width: 1840,
        height: 1455,
        wheelbase: 2825
      }
    },
    features: {
      safety: ['10 Airbags', 'Toyota Safety Sense', 'Pre-collision System'],
      comfort: ['Leather Seats', 'Dual Zone AC', 'Power Seats'],
      technology: ['9-inch Touchscreen', 'Wireless Charging', 'JBL Audio'],
      exterior: ['LED Headlights', 'Sunroof', '18-inch Alloys'],
      interior: ['Premium Interior', 'Ambient Lighting', 'Heated Seats']
    },
    images: ['https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=500'],
    colors: ['Pearl White', 'Attitude Black', 'Silver Metallic', 'Graphite Metallic'],
    variants: [],
    dealers: [],
    lastUpdated: new Date().toISOString()
  },
  {
    id: '3',
    make: 'Honda',
    model: 'CR-V',
    year: 2024,
    bodyType: 'SUV',
    priceRange: { min: 32, max: 38 },
    fuelType: 'Petrol',
    mileage: 14.4,
    safetyRating: 5,
    image: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=500',
    pros: ['Spacious cabin', 'Advanced safety features', 'Strong build quality', 'Good ground clearance'],
    cons: ['Lower fuel efficiency', 'Expensive maintenance', 'Road noise'],
    specs: {
      engine: '1.5L Turbo',
      transmission: 'CVT',
      seating: 7,
      bootSpace: 522,
      groundClearance: 208
    }
  },
  {
    id: '4',
    make: 'Mahindra',
    model: 'XUV700',
    year: 2024,
    bodyType: 'SUV',
    priceRange: { min: 14, max: 25 },
    fuelType: 'Diesel',
    mileage: 16.5,
    safetyRating: 5,
    image: 'https://images.pexels.com/photos/1119796/pexels-photo-1119796.jpeg?auto=compress&cs=tinysrgb&w=500',
    pros: ['Value for money', 'Feature-rich', 'Powerful engine', 'Spacious interior'],
    cons: ['Build quality concerns', 'Service network', 'Fuel efficiency could be better'],
    specs: {
      engine: '2.0L Turbo Diesel',
      transmission: 'Manual/AT',
      seating: 7,
      bootSpace: 408,
      groundClearance: 200
    }
  },
  {
    id: '5',
    make: 'Hyundai',
    model: 'Creta',
    year: 2024,
    bodyType: 'SUV',
    priceRange: { min: 11, max: 18 },
    fuelType: 'Petrol',
    mileage: 17.4,
    safetyRating: 4,
    image: 'https://images.pexels.com/photos/2920064/pexels-photo-2920064.jpeg?auto=compress&cs=tinysrgb&w=500',
    pros: ['Stylish design', 'Feature-loaded', 'Comfortable ride', 'Good build quality'],
    cons: ['Rear seat space', 'Engine noise', 'Premium pricing'],
    specs: {
      engine: '1.5L Petrol',
      transmission: 'Manual/AT',
      seating: 5,
      bootSpace: 433,
      groundClearance: 190
    }
  },
  {
    id: '6',
    make: 'Tata',
    model: 'Nexon EV',
    year: 2024,
    bodyType: 'SUV',
    priceRange: { min: 15, max: 19 },
    fuelType: 'Electric',
    mileage: 0, // Range instead
    safetyRating: 5,
    image: 'https://images.pexels.com/photos/1719647/pexels-photo-1719647.jpeg?auto=compress&cs=tinysrgb&w=500',
    pros: ['Zero emissions', 'Low running cost', 'Good safety rating', 'Modern features'],
    cons: ['Limited charging infrastructure', 'Range anxiety', 'Longer charging time'],
    specs: {
      engine: 'Electric Motor',
      transmission: 'Single Speed',
      seating: 5,
      bootSpace: 350,
      groundClearance: 209
    }
  }
];

export const CarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cars] = useState<CarDetail[]>(mockCars);
  const [recommendations, setRecommendations] = useState<CarDetail[]>([]);
  const [savedCars, setSavedCars] = useState<string[]>([]);
  const [quizResults, setQuizResultsState] = useState<QuizAnswer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    // Load saved cars from localStorage
    const saved = localStorage.getItem('carMatchSavedCars');
    if (saved) {
      try {
        setSavedCars(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved cars:', error);
      }
    }
  }, []);

  const calculateMatchScore = (car: CarDetail, answers: QuizAnswer): number => {
    let score = 0;
    let maxScore = 0;

    // Budget match (25 points)
    maxScore += 25;
    const budgetMapping: Record<string, { min: number; max: number }> = {
      'under-5': { min: 0, max: 5 },
      '5-10': { min: 5, max: 10 },
      '10-20': { min: 10, max: 20 },
      '20-35': { min: 20, max: 35 },
      'above-35': { min: 35, max: 100 }
    };
    
    const budgetRange = budgetMapping[answers.budget];
    if (budgetRange && car.priceRange.min >= budgetRange.min && car.priceRange.max <= budgetRange.max) {
      score += 25;
    } else if (budgetRange && car.priceRange.min <= budgetRange.max && car.priceRange.max >= budgetRange.min) {
      score += 15; // Partial match
    }

    // Vehicle type match (20 points)
    maxScore += 20;
    if (answers.vehicleType === car.bodyType.toLowerCase()) {
      score += 20;
    }

    // Fuel type match (15 points)
    maxScore += 15;
    if (answers.fuelType === 'any' || answers.fuelType === car.fuelType.toLowerCase()) {
      score += 15;
    }

    // Priority matches (30 points total, 10 each for top 3)
    maxScore += 30;
    if (answers.priority) {
      answers.priority.slice(0, 3).forEach(priority => {
        switch (priority) {
          case 'economy':
            if (car.mileage >= 18) score += 10;
            else if (car.mileage >= 15) score += 5;
            break;
          case 'safety':
            if (car.safetyRating >= 5) score += 10;
            else if (car.safetyRating >= 4) score += 7;
            break;
          case 'price':
            if (car.priceRange.min <= 10) score += 10;
            else if (car.priceRange.min <= 15) score += 7;
            break;
          case 'performance':
            if (car.bodyType === 'SUV' || car.specs.engine.includes('Turbo')) score += 10;
            break;
          case 'reliability':
            if (['Toyota', 'Honda', 'Maruti Suzuki'].includes(car.make)) score += 10;
            break;
        }
      });
    }

    // Seating capacity (10 points)
    maxScore += 10;
    const requiredSeats = parseInt(answers.seating.replace('+', ''));
    if (car.specs.seating >= requiredSeats) {
      score += 10;
    }

    return Math.round((score / maxScore) * 100);
  };

  const setQuizResults = (results: QuizAnswer) => {
    setQuizResultsState(results);
    
    // Generate recommendations based on quiz results
    const scoredCars = cars.map(car => ({
      ...car,
      matchScore: calculateMatchScore(car, results),
      priceCategory: results.budget
    })).sort((a, b) => b.matchScore - a.matchScore);

    setRecommendations(scoredCars.slice(0, 8)); // Top 8 recommendations
  };

  const saveCar = (carId: string) => {
    const updatedSaved = [...savedCars, carId];
    setSavedCars(updatedSaved);
    localStorage.setItem('carMatchSavedCars', JSON.stringify(updatedSaved));
  };

  const removeSavedCar = (carId: string) => {
    const updatedSaved = savedCars.filter(id => id !== carId);
    setSavedCars(updatedSaved);
    localStorage.setItem('carMatchSavedCars', JSON.stringify(updatedSaved));
  };

  const getCarById = (id: string): CarDetail | undefined => {
    return cars.find(car => car.id === id);
  };

  const searchCars = (filters: any): CarDetail[] => {
    return cars.filter(car => {
      // Apply filters
      if (filters.bodyType && car.bodyType.toLowerCase() !== filters.bodyType.toLowerCase()) {
        return false;
      }
      if (filters.fuelType && car.fuelType.toLowerCase() !== filters.fuelType.toLowerCase()) {
        return false;
      }
      if (filters.minPrice && car.priceRange.min < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice && car.priceRange.max > filters.maxPrice) {
        return false;
      }
      return true;
    });
  };

  const searchCarsAdvanced = async (params: CarSearchParams) => {
    setIsLoading(true);
    setSearchError(null);
    
    try {
      const result = await carApiService.searchCars(params, quizResults);
      setRecommendations(result.cars);
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : 'Search failed');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <CarContext.Provider value={{
      cars,
      recommendations,
      savedCars,
      quizResults,
      setQuizResults,
      saveCar,
      removeSavedCar,
      getCarById,
      searchCars,
      searchCarsAdvanced,
      isLoading,
      searchError
    }}>
      {children}
    </CarContext.Provider>
  );
};