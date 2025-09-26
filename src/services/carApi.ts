export interface CarFilters {
  budget?: { min: number; max: number };
  fuelType?: string[];
  brand?: string[];
  bodyType?: string[];
  seating?: { min: number; max: number };
  mileage?: { min: number };
  safetyRating?: { min: number };
  transmission?: string[];
  year?: { min: number; max: number };
}

export interface CarSearchParams extends CarFilters {
  query?: string;
  sortBy?: 'price' | 'mileage' | 'safety' | 'popularity' | 'year';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  location?: string;
}

export interface CarVariant {
  id: string;
  name: string;
  price: number;
  features: string[];
  engine: string;
  transmission: string;
  fuelType: string;
  mileage: number;
}

export interface CarDealer {
  id: string;
  name: string;
  location: string;
  contact: string;
  rating: number;
  distance: number;
  availability: boolean;
  price: number;
  offers: string[];
}

export interface CarDetail {
  id: string;
  make: string;
  model: string;
  year: number;
  bodyType: string;
  priceRange: { min: number; max: number };
  fuelType: string;
  mileage: number;
  safetyRating: number;
  images: string[];
  colors: string[];
  variants: CarVariant[];
  dealers: CarDealer[];
  specs: {
    engine: string;
    transmission: string;
    seating: number;
    bootSpace: number;
    groundClearance: number;
    fuelTankCapacity: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
      wheelbase: number;
    };
  };
  features: {
    safety: string[];
    comfort: string[];
    technology: string[];
    exterior: string[];
    interior: string[];
  };
  pros: string[];
  cons: string[];
  matchScore?: number;
  compatibilityReasons?: string[];
  lastUpdated: string;
}

export interface CarSearchResponse {
  cars: CarDetail[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  filters: {
    availableBrands: string[];
    priceRange: { min: number; max: number };
    availableFuelTypes: string[];
    availableBodyTypes: string[];
  };
}

export interface CarOffer {
  id: string;
  carId: string;
  dealerId: string;
  title: string;
  description: string;
  discount: number;
  validUntil: string;
  terms: string[];
  type: 'cash_discount' | 'exchange_bonus' | 'financing' | 'insurance';
}

class CarApiService {
  private baseUrl = '/api/cars';
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private calculateMatchScore(car: CarDetail, preferences: any): number {
    let score = 0;
    let maxScore = 0;

    // Budget compatibility (25 points)
    maxScore += 25;
    if (preferences.budget) {
      const { min, max } = preferences.budget;
      if (car.priceRange.min >= min && car.priceRange.max <= max) {
        score += 25;
      } else if (car.priceRange.min <= max && car.priceRange.max >= min) {
        score += 15; // Partial overlap
      }
    }

    // Fuel type match (20 points)
    maxScore += 20;
    if (preferences.fuelType?.includes(car.fuelType)) {
      score += 20;
    }

    // Body type match (15 points)
    maxScore += 15;
    if (preferences.bodyType?.includes(car.bodyType)) {
      score += 15;
    }

    // Mileage preference (15 points)
    maxScore += 15;
    if (preferences.mileage?.min && car.mileage >= preferences.mileage.min) {
      score += 15;
    }

    // Safety rating (15 points)
    maxScore += 15;
    if (preferences.safetyRating?.min && car.safetyRating >= preferences.safetyRating.min) {
      score += 15;
    }

    // Seating capacity (10 points)
    maxScore += 10;
    if (preferences.seating?.min && car.specs.seating >= preferences.seating.min) {
      score += 10;
    }

    return Math.round((score / maxScore) * 100);
  }

  private generateCompatibilityReasons(car: CarDetail, preferences: any): string[] {
    const reasons: string[] = [];

    if (preferences.budget) {
      const { min, max } = preferences.budget;
      if (car.priceRange.min >= min && car.priceRange.max <= max) {
        reasons.push('Perfect budget match');
      }
    }

    if (preferences.fuelType?.includes(car.fuelType)) {
      reasons.push(`${car.fuelType} fuel as preferred`);
    }

    if (preferences.bodyType?.includes(car.bodyType)) {
      reasons.push(`${car.bodyType} body type matches your needs`);
    }

    if (preferences.mileage?.min && car.mileage >= preferences.mileage.min) {
      reasons.push(`Excellent fuel economy (${car.mileage} kmpl)`);
    }

    if (car.safetyRating >= 4) {
      reasons.push(`High safety rating (${car.safetyRating}/5 stars)`);
    }

    return reasons.slice(0, 4);
  }

  async searchCars(params: CarSearchParams, userPreferences?: any): Promise<CarSearchResponse> {
    const cacheKey = `search_${JSON.stringify(params)}`;
    const cached = this.getFromCache<CarSearchResponse>(cacheKey);
    if (cached) return cached;

    try {
      const queryParams = new URLSearchParams();
      
      // Add search parameters
      if (params.query) queryParams.append('q', params.query);
      if (params.budget) {
        queryParams.append('minPrice', params.budget.min.toString());
        queryParams.append('maxPrice', params.budget.max.toString());
      }
      if (params.fuelType?.length) {
        params.fuelType.forEach(type => queryParams.append('fuelType', type));
      }
      if (params.brand?.length) {
        params.brand.forEach(brand => queryParams.append('brand', brand));
      }
      if (params.bodyType?.length) {
        params.bodyType.forEach(type => queryParams.append('bodyType', type));
      }
      if (params.seating) {
        if (params.seating.min) queryParams.append('minSeating', params.seating.min.toString());
        if (params.seating.max) queryParams.append('maxSeating', params.seating.max.toString());
      }
      if (params.mileage?.min) queryParams.append('minMileage', params.mileage.min.toString());
      if (params.safetyRating?.min) queryParams.append('minSafety', params.safetyRating.min.toString());
      if (params.transmission?.length) {
        params.transmission.forEach(trans => queryParams.append('transmission', trans));
      }
      if (params.year) {
        if (params.year.min) queryParams.append('minYear', params.year.min.toString());
        if (params.year.max) queryParams.append('maxYear', params.year.max.toString());
      }
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.location) queryParams.append('location', params.location);

      const response = await fetch(`${this.baseUrl}/search?${queryParams}`);
      if (!response.ok) throw new Error('Failed to search cars');
      
      const data: CarSearchResponse = await response.json();
      
      // Calculate match scores if user preferences are provided
      if (userPreferences) {
        data.cars = data.cars.map(car => ({
          ...car,
          matchScore: this.calculateMatchScore(car, userPreferences),
          compatibilityReasons: this.generateCompatibilityReasons(car, userPreferences)
        }));
        
        // Sort by match score if no other sorting specified
        if (!params.sortBy) {
          data.cars.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
        }
      }

      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error searching cars:', error);
      throw error;
    }
  }

  async getCarById(id: string): Promise<CarDetail> {
    const cacheKey = `car_${id}`;
    const cached = this.getFromCache<CarDetail>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) throw new Error('Car not found');
      
      const car: CarDetail = await response.json();
      this.setCache(cacheKey, car);
      return car;
    } catch (error) {
      console.error('Error fetching car details:', error);
      throw error;
    }
  }

  async getLatestOffers(limit: number = 10): Promise<CarOffer[]> {
    const cacheKey = `offers_${limit}`;
    const cached = this.getFromCache<CarOffer[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`${this.baseUrl}/offers?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch offers');
      
      const offers: CarOffer[] = await response.json();
      this.setCache(cacheKey, offers);
      return offers;
    } catch (error) {
      console.error('Error fetching offers:', error);
      throw error;
    }
  }

  async getCarsByIds(ids: string[]): Promise<CarDetail[]> {
    const cacheKey = `cars_${ids.sort().join(',')}`;
    const cached = this.getFromCache<CarDetail[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`${this.baseUrl}/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
      });
      
      if (!response.ok) throw new Error('Failed to fetch cars');
      
      const cars: CarDetail[] = await response.json();
      this.setCache(cacheKey, cars);
      return cars;
    } catch (error) {
      console.error('Error fetching cars by IDs:', error);
      throw error;
    }
  }

  async getSimilarCars(carId: string, limit: number = 5): Promise<CarDetail[]> {
    try {
      const response = await fetch(`${this.baseUrl}/${carId}/similar?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch similar cars');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching similar cars:', error);
      throw error;
    }
  }

  async getCarAvailability(carId: string, location?: string): Promise<CarDealer[]> {
    try {
      const params = location ? `?location=${encodeURIComponent(location)}` : '';
      const response = await fetch(`${this.baseUrl}/${carId}/availability${params}`);
      if (!response.ok) throw new Error('Failed to fetch availability');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching car availability:', error);
      throw error;
    }
  }

  // Real-time updates using Server-Sent Events
  subscribeToUpdates(callback: (update: any) => void): () => void {
    const eventSource = new EventSource(`${this.baseUrl}/updates`);
    
    eventSource.onmessage = (event) => {
      try {
        const update = JSON.parse(event.data);
        callback(update);
        
        // Invalidate relevant cache entries
        if (update.type === 'car_updated' || update.type === 'car_added') {
          this.cache.delete(`car_${update.carId}`);
          // Clear search cache
          for (const key of this.cache.keys()) {
            if (key.startsWith('search_')) {
              this.cache.delete(key);
            }
          }
        }
      } catch (error) {
        console.error('Error processing update:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
    };

    return () => {
      eventSource.close();
    };
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const carApiService = new CarApiService();