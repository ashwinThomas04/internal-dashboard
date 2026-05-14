import { COUNTRIES, COUNTRY_CODE, COUNTRY_CODES, DEFAULT_COUNTRY, FORMATTERS, GENDER_OPTIONS, PHONE_RULES } from "./constants";
import CACHE_KEYS from "./cacheKeys";
import HEADER_NAV from "./header";

const ENV = "prod"
const DOM_BASE_ID = "qubriux-app-wrapper";
const THEMES_POSITION_MARKER = "#qb-style-position-marker";
const META_TITLE = "Loyalty program";

const UI_VERSION = "2.0";

const API_BASE = {
    "qa": "https://qa.qubriux.com/ezloyal-web",
    "prod": "https://app.qubriux.com/ezloyal-web"
}

const ASSET_BASE = {
    "qa": "https://qbshopper-public.s3.ap-south-1.amazonaws.com",
    "prod": "https://qbshopper-assets-public.s3.us-east-2.amazonaws.com"
}

const APP_CONFIG = {
    dashboardType: "loyalty",
    currency: "AED",
    rootPath: "/app/home",
    dashboardTitle: "My Loyalty Account",
    showCommunicationSection: true,
    useHeaderLogo: true,
    dropdownOptions: {
        phone: COUNTRY_CODES,
        gender: GENDER_OPTIONS,
        nationality: COUNTRIES,
        store: []
    },
    defaultCountryCode: COUNTRY_CODE,
    defaultCountry: DEFAULT_COUNTRY,
    usePasswordFlow: true,
    phoneRules: PHONE_RULES,
    phoneFormatters: FORMATTERS,
    defaultStore: null,
    signupSuccessMessage: "Congratulations on signing up for our loyalty program. Stay Tuned! Exciting offers and loyalty rewards are on your way."
}

const CONFIG = {
    env: ENV,
    domBaseID: DOM_BASE_ID,
    appVersion: UI_VERSION,
    apiBase: API_BASE[ENV],
    appMetaTitle: META_TITLE,
    assetsBase: ASSET_BASE[ENV],
    themesPositionMarker: THEMES_POSITION_MARKER
}

export { CACHE_KEYS, HEADER_NAV, APP_CONFIG };
export default CONFIG;