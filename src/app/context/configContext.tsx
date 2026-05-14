import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ConfigType, UiConfig } from "./context";
import { APP_CONFIG, HEADER_NAV } from "../config";

const ConfigContext = createContext<ConfigType | null>(null);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
    const [ui, setUi] = useState<UiConfig | null>(null);
    const [mx, setMx] = useState<string | null>(null);
    const [header, setHeader] = useState<Record<string, any>[] | null>([...HEADER_NAV]);
    const [merchantStores, setMerchantStores] = useState<Record<string, any>[] | null>(null);
    const [brandConfig, setBrandConfig] = useState<Record<string, any> | null>(null);
    const [branding, setBranding] = useState<Record<string, any> | null>(null);

    const getPhoneAndCode = useCallback((input: string, alpha2: string) => {
        const rule = ui?.phoneRules ? ui.phoneRules[alpha2] : null;
        if (!rule || !input) return { code: "", number: input };
        let digits = input.replace(/\D/g, "");
        if (digits.startsWith(rule.code)) digits = digits.slice(rule.code.length);
        return { code: rule.code, number: digits };
    }, [ui])

    const formatPhone = useCallback((input: string, alpha2: string) => {
        const rule = ui?.phoneRules ? ui.phoneRules[alpha2] : null;
        if (!rule || !input) return input;

        let digits = input.replace(/\D/g, "");
        if (digits.startsWith(rule.code)) digits = digits.slice(rule.code.length);
        if (digits.startsWith("0")) digits = digits.slice(1);

        const formatter = ui?.phoneFormatters ? ui.phoneFormatters[alpha2] : null;

        return `+${rule.code} ${formatter ? formatter(digits) : digits}`;
    }, [ui]);

    useEffect(() => {
        if (brandConfig && merchantStores && branding) {
            const c: UiConfig = (ui ? { ...ui } : { ...APP_CONFIG }) as UiConfig;
            c.dropdownOptions.store = merchantStores?.map((s) => {
                if (s.storeId == branding?.store?.storeId) c.defaultStore = { label: s.storeName, value: s.storeId };
                return ({
                    label: s.storeName,
                    value: s.storeId,
                    search: s.storeName.toLowerCase()
                })
            });
            if (brandConfig.c) {
                c.rootPath = brandConfig.c.rootPath;
                c.dashboardTitle = brandConfig.c.dashboardTitle;
                c.useHeaderLogo = brandConfig.c.useHeaderLogo;
                c.showCommunicationSection = brandConfig.c.showCommunicationSection;
                c.usePasswordFlow = brandConfig.c.usePasswordFlow;
                c["signupSchema"] = brandConfig.c?.signupSchema;
                c.defaultCountry = c.dropdownOptions.nationality?.find(n => n.alpha2 === brandConfig.c.defaultCountry);
                c.defaultCountryCode = c.dropdownOptions.phone?.find(n => n.alpha2 === brandConfig.c.defaultCountry);
                if (c.signupSchema?.nationality) c.signupSchema.nationality["defaultValue"] = c.defaultCountry;
                if (c.signupSchema?.phone) c.signupSchema.phone["defaultValue"] = c.defaultCountryCode;
                if (brandConfig.c?.dashboardType) c.dashboardType = brandConfig.c.dashboardType;
                if (brandConfig.c?.headerConfig) setHeader(brandConfig.c.headerConfig);
            }
            setUi({ ...c });
        }
    }, [brandConfig, merchantStores, branding]);

    const config = useMemo(() => {
        return {
            ui,
            mx,
            header,
            merchantStores,
            branding,
            updateMx: setMx,
            updateUiConfig: setUi,
            updateStores: setMerchantStores,
            updateBrandConfig: setBrandConfig,
            updateBranding: setBranding,
            updateHeader: setHeader,
            formatPhone,
            getPhoneAndCode
        }
    }, [ui, mx, merchantStores, branding]);

    return (
        <ConfigContext.Provider value={config}>
            {children}
        </ConfigContext.Provider>
    )
}

export const useConfig = () => {
    const auth = useContext(ConfigContext);
    if (!auth) throw new Error("Config Context missing");
    return auth;
}