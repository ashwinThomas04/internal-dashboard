import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { CacheStorageType, CacheStore } from "./context";
import { dateTime } from "../utils";

const CacheContext = createContext<CacheStorageType | null>(null);

export const CacheProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<CacheStore>({})

  const setItem = useCallback((key: string, value: any, ttl?: number) => {
    setData(prev => ({ ...prev, [key]: { value, expiry: ttl ? dateTime.getExpiryTime(ttl) : null } }));
  }, []);

  const removeItem = useCallback((key: string) => {
    setData((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  }, []);

  const clean = useCallback(() => {
    setData({});
  }, []);

  const getItem = useCallback((key: string) => {
    if (data && data[key]) {
      if (data[key].expiry && dateTime.isExpired(data[key].expiry)) {
        setData((prev) => {
          const copy = { ...prev };
          delete copy[key];
          return copy;
        });
        return null;
      }
      return data[key].value;
    }
    return null;
  }, [data]);

  const storage = useMemo(() => ({
    setItem,
    removeItem,
    clean,
    getItem
  }), [setItem, removeItem, clean, getItem]);

  return (
    <CacheContext.Provider value={storage}>
      {children}
    </CacheContext.Provider>
  )
}

export const useCache = () => {
  const storage = useContext(CacheContext);
  if (!storage) throw new Error("App Storage is not initialized");
  return storage;
}