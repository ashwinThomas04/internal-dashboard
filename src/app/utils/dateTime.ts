export const convertToSeconds = (t: number) => t * 1000;

export const convertToMinutes = (t: number) => t * 60 * 1000;

export const convertToHours = (t: number) => t * 60 * 60 * 1000;

export const getExpiryTime = (t: number) => Date.now() + convertToMinutes(t);

export const getExpiryHours = (t: number) => Date.now() + convertToHours(t);

export const getDisplayDate = (val: string) => { return new Date(val).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) };

export const isExpired = (t: number) => Date.now() > t;