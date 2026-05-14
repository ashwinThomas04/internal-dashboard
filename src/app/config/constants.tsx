export { COUNTRIES } from "./countries"

export const COUNTRY_CODES = [
  { "label": "India", "value": "91", "code": "+91", "alpha2": "IN" },
  { "label": "United States", "value": "1", "code": "+1", "alpha2": "US" },
  { "label": "Mexico", "value": "52", "code": "+52", "alpha2": "MX" },
  { "label": "United Arab Emirates", "value": "971", "code": "+971", "alpha2": "AE" },
  { "label": "Saudi Arabia", "value": "966", "code": "+966", "alpha2": "SA" }
];

export const GENDER_OPTIONS = [
  { "label": "Male", "value": "male" },
  { "label": "Female", "value": "female" },
  { "label": "Other", "value": "other" }
]

export const PHONE_RULES = {
  US: { code: "1", length: 10 },
  MX: { code: "52", length: 10 },
  IN: { code: "91", length: 10 },
  AE: { code: "971", length: 9 },
  SA: { code: "966", length: 9 }
};

export const FORMATTERS = {
  US: (n: string) => `(${n.slice(0, 3)}) ${n.slice(3, 6)}-${n.slice(6, 10)}`,
  MX: (n: string) => `${n.slice(0, 2)} ${n.slice(2, 6)} ${n.slice(6, 10)}`,
  IN: (n: string) => `${n.slice(0, 5)} ${n.slice(5, 10)}`,
  AE: (n: string) => `${n.slice(0, 2)} ${n.slice(2, 5)} ${n.slice(5, 9)}`,
  SA: (n: string) => `${n.slice(0, 2)} ${n.slice(2, 5)} ${n.slice(5, 9)}`
};

export const DEFAULT_COUNTRY = { "label": "United Arab Emirates", "value": "ARE", "alpha2": "AE", "alpha3": "ARE" };

export const COUNTRY_CODE = { "label": "United Arab Emirates", "value": "971", "code": "+971" };