import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useApi, useStorage } from "../service/hooks";
import { AuthType } from "./context";
import CONFIG from "../config";
import { useCache } from "./appStorage";
import { dateTime, utils } from "../utils";

const AuthContext = createContext<AuthType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<Record<string, any> | null>(null);
  const [user, setUser] = useState<Record<string, any> | null>(null);
  const [store, setStore] = useState<Record<string, any> | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const cache = useCache();
  const storage = useStorage();
  const api = useApi();

  const onSignOut = useCallback(() => {
    storage.onSignOut();
    cache.clean();
    setUser(null);
    setData(null);
  }, [storage]);

  const getUser = useCallback(async (token?: string) => {
    const url = `${CONFIG.apiBase}/consumer/info`;
    const res = await api.get(url, token);
    if (res.ok) {
      const data = { ...res.body, initials: utils.getInitials(res.body.name), expiry: dateTime.getExpiryHours(48) };
      storage.setUserInfo(JSON.stringify(data));
      setUser(data);
    }
    else onSignOut();
  }, [api, storage, onSignOut]);

  const auth = useMemo(() => {
    const token = data?.accessToken ? data.accessToken : null;
    const isAuthenticated = token ? true : false;

    return {
      token,
      isAuthenticated,
      isHydrated,
      data,
      user,
      store,
      update: setData,
      updateUser: getUser,
      updateStore: setStore,
      onSignOut
    }
  }, [isHydrated, user, data, store, onSignOut]);

  useEffect(() => {
    const a = storage.getAuthInfo();
    const u = storage.getUserInfo();

    if (a) setData(a);
    if (u && !dateTime.isExpired(u.expiry)) setUser(u);
    else if (a?.accessToken) getUser(a.accessToken);

    setIsHydrated(true);
  }, [storage]);

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("Auth context is missing");
  return auth;
}