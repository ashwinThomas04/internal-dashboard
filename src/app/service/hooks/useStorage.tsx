import { useRef } from "react";

class AppStorage {
    private storeId: string = "QBX_STORE_ID";
    private authData: string = "QBX_AUTH_DATA";
    private userData: string = "QBX_USER_DATA";

    setSessionCache(key: string, data: string) {
        sessionStorage.setItem(key, data);
    }

    getSessionCache(key: string) {
        const a = sessionStorage.getItem(key);
        if (a) return JSON.parse(a);
        else return null;
    }

    setStoreId(id: string) {
        localStorage.setItem(this.storeId, id);
    }

    getStoreId() {
        return localStorage.getItem(this.storeId);
    }

    setUserInfo(info: string) {
        localStorage.setItem(this.userData, info);
    }

    getUserInfo() {
        const a = localStorage.getItem(this.userData);
        if (a) return JSON.parse(a);
        else return null;
    }

    setAuthInfo(info: string) {
        localStorage.setItem(this.authData, info);
    }

    getAuthInfo() {
        const a = localStorage.getItem(this.authData);
        if (a) return JSON.parse(a);
        else return null;
    }

    onSignOut() {
        localStorage.removeItem(this.userData);
        localStorage.removeItem(this.authData);
    }

    onNuke() {
        localStorage.clear();
        sessionStorage.clear();
    }
}

const useStorage = () => {
    const storage = useRef<AppStorage>(null);
    if (!storage.current) storage.current = new AppStorage();
    return storage.current;
}

export default useStorage;