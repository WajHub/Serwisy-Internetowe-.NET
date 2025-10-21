import { useCallback, useMemo } from 'react';
import { useLocation } from 'wouter';

export function useUrlParams() {
  const [, setLocation] = useLocation();

  const searchParams = useMemo(() => {
    if (typeof window === 'undefined') return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  }, []);

  const getParam = useCallback((key: string, defaultValue?: string): string | undefined => {
    return searchParams.get(key) || defaultValue;
  }, [searchParams]);

  const getArrayParam = useCallback((key: string): string[] => {
    const value = searchParams.get(key);
    return value ? value.split(',') : [];
  }, [searchParams]);

  const setParam = useCallback((key: string, value: string | string[] | undefined) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value === undefined || (Array.isArray(value) && value.length === 0)) {
      newParams.delete(key);
    } else if (Array.isArray(value)) {
      newParams.set(key, value.join(','));
    } else {
      newParams.set(key, value);
    }

    const newUrl = `${window.location.pathname}${newParams.toString() ? `?${newParams.toString()}` : ''}`;
    setLocation(newUrl);
  }, [searchParams, setLocation]);

  const setMultipleParams = useCallback((params: Record<string, string | string[] | undefined>) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || (Array.isArray(value) && value.length === 0)) {
        newParams.delete(key);
      } else if (Array.isArray(value)) {
        newParams.set(key, value.join(','));
      } else {
        newParams.set(key, value);
      }
    });

    const newUrl = `${window.location.pathname}${newParams.toString() ? `?${newParams.toString()}` : ''}`;
    setLocation(newUrl);
  }, [searchParams, setLocation]);

  const clearParams = useCallback(() => {
    setLocation(window.location.pathname);
  }, [setLocation]);

  return {
    getParam,
    getArrayParam,
    setParam,
    setMultipleParams,
    clearParams,
  };
}
