import { useState, useEffect, useCallback } from 'react';
import { carApiService, CarSearchParams, CarDetail, CarSearchResponse, CarOffer } from '../services/carApi';

export const useCarSearch = (initialParams?: CarSearchParams) => {
  const [data, setData] = useState<CarSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<CarSearchParams>(initialParams || {});

  const search = useCallback(async (searchParams?: CarSearchParams, userPreferences?: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const finalParams = searchParams || params;
      const result = await carApiService.searchCars(finalParams, userPreferences);
      setData(result);
      if (searchParams) setParams(searchParams);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }, [params]);

  const loadMore = useCallback(async () => {
    if (!data || !data.hasNextPage || loading) return;
    
    setLoading(true);
    try {
      const nextPageParams = { ...params, page: data.currentPage + 1 };
      const result = await carApiService.searchCars(nextPageParams);
      setData(prev => prev ? {
        ...result,
        cars: [...prev.cars, ...result.cars]
      } : result);
      setParams(nextPageParams);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more');
    } finally {
      setLoading(false);
    }
  }, [data, params, loading]);

  const updateFilters = useCallback((newFilters: Partial<CarSearchParams>) => {
    const updatedParams = { ...params, ...newFilters, page: 1 };
    setParams(updatedParams);
    search(updatedParams);
  }, [params, search]);

  useEffect(() => {
    if (Object.keys(params).length > 0) {
      search();
    }
  }, []);

  return {
    data,
    loading,
    error,
    params,
    search,
    loadMore,
    updateFilters,
    hasMore: data?.hasNextPage || false
  };
};

export const useCarDetail = (carId: string | null) => {
  const [car, setCar] = useState<CarDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCar = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await carApiService.getCarById(id);
      setCar(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch car');
      setCar(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (carId) {
      fetchCar(carId);
    } else {
      setCar(null);
    }
  }, [carId, fetchCar]);

  return { car, loading, error, refetch: () => carId && fetchCar(carId) };
};

export const useCarOffers = (limit?: number) => {
  const [offers, setOffers] = useState<CarOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await carApiService.getLatestOffers(limit);
      setOffers(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch offers');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  return { offers, loading, error, refetch: fetchOffers };
};

export const useCarComparison = (carIds: string[]) => {
  const [cars, setCars] = useState<CarDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCars = useCallback(async (ids: string[]) => {
    if (ids.length === 0) {
      setCars([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await carApiService.getCarsByIds(ids);
      setCars(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cars for comparison');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCars(carIds);
  }, [carIds, fetchCars]);

  return { cars, loading, error };
};

export const useSimilarCars = (carId: string | null, limit?: number) => {
  const [similarCars, setSimilarCars] = useState<CarDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSimilarCars = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await carApiService.getSimilarCars(id, limit);
      setSimilarCars(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch similar cars');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    if (carId) {
      fetchSimilarCars(carId);
    } else {
      setSimilarCars([]);
    }
  }, [carId, fetchSimilarCars]);

  return { similarCars, loading, error };
};

export const useRealTimeUpdates = () => {
  const [updates, setUpdates] = useState<any[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    setConnected(true);
    
    const unsubscribe = carApiService.subscribeToUpdates((update) => {
      setUpdates(prev => [update, ...prev.slice(0, 49)]); // Keep last 50 updates
    });

    return () => {
      setConnected(false);
      unsubscribe();
    };
  }, []);

  const clearUpdates = useCallback(() => {
    setUpdates([]);
  }, []);

  return { updates, connected, clearUpdates };
};