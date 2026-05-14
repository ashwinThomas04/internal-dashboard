export type UiConfig = {
    dashboardType: "loyalty" | "subscription",
    currency: string,
    signupSchema?: Record<string, any> | null,
    rootPath?: string,
    dashboardTitle?: string,
    useHeaderLogo?: boolean,
    showCommunicationSection?: boolean,
    dropdownOptions: {
        phone: Record<string, string>[] | null,
        gender: Record<string, string>[] | null,
        nationality: Record<string, string>[] | null,
        store?: Record<string, any>[] | null
    }
    defaultCountryCode?: Record<string, string> | null,
    defaultCountry?: Record<string, string> | null,
    defaultStore?: Record<string, any> | null,
    phoneRules?: Record<string, any> | null,
    phoneFormatters?: Record<string, (input: string) => string> | null,
    usePasswordFlow?: boolean
}

export type ConfigType = {
    ui: UiConfig | null,
    mx: string | null,
    merchantStores: Record<string, any>[] | null,
    branding: Record<string, any> | null,
    updateMx: (data: any) => void,
    updateUiConfig: (data: any) => void,
    updateStores: (stores: Record<string, any>[] | null) => void,
    updateBrandConfig: (data: Record<string, any> | null) => void,
    updateBranding: (data: Record<string, any> | null) => void,
    formatPhone: (input: string, alpha2: string) => string,
    getPhoneAndCode: (input: string, alpha2: string) => { code: string, number: string }
}

export type AuthType = {
    token: string | null,
    isAuthenticated: boolean,
    isHydrated: boolean,
    data: Record<string, any> | null,
    user: Record<string, any> | null,
    store: Record<string, any> | null,
    update: (data: Record<string, any>) => void,
    updateUser: () => void,
    updateStore: (data: Record<string, any>) => void,
    onSignOut: () => void
}

export type CacheItem = {
    value: any;
    expiry: number | null;
};

export type CacheStore = Record<string, CacheItem>;

/**
 * In-memory cache storage with optional TTL support.
 */
export type CacheStorageType = {
    /**
     * Stores a value against a key.
     * @param key Unique identifier for the cache item
     * @param value Data to store
     * @param ttl Time to live in minutes (optional)
     */
    setItem: (key: string, value: Record<string, any>, ttl?: number) => void,
    /**
     * Removes a cache item by key.
     * @param key Unique identifier for the cache item
     */
    removeItem: (key: string) => void,
    /**
     * Removes all cache items.
     */
    clean: () => void,
    /**
     * Retrieves a cache item by key.
     * @param key Unique identifier for the cache item
     * @returns The cached value or null if not found or expired
     */
    getItem: (key: string) => any;
}  