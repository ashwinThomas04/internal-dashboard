import * as QRCode from 'qrcode';

const DECODE_BASE = 26;
const DECODE_SHIFT = 65;
const KEY = "AJSBDKASJHDAKSD";

export const generateCipher = (data: string) => {
  let cipherText = "";

  for (let i = 0; i < data.length; i++) {
    const charCode = data.charCodeAt(i);
    const numericValue = charCode >= 48 && charCode <= 57
      ? charCode - 48
      : charCode >= 65 && charCode <= 90
        ? charCode - 55
        : charCode >= 97 && charCode <= 122
          ? charCode - 87
          : -1;

    const x =
      (numericValue + (KEY.charCodeAt(i) - DECODE_SHIFT)) % DECODE_BASE
      + DECODE_SHIFT;

    cipherText += String.fromCharCode(x);
  }

  return cipherText;
}

export const safeParse = <T>(value: string | null): T | null => {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

export const sanitizeName = (name: string) => name.trim().toLowerCase().replace(/\s+/g, "-");

export const getInitials = (name: string | undefined) => {
  if (!name || !name.length) return null;
  let matches: any; let initials = "";
  matches = name.match(/\b(\w)/g);
  if (matches?.length) {
    initials = matches[0];
    if (matches.length > 1) initials = matches[0] + matches[matches.length - 1];
  }
  return initials;
}

export const appendCss = (url: string, marker: string) => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  document.head.insertBefore(link, document.querySelector(marker));
}

export const appendLink = (url: string) => {
  const link = document.createElement("link");
  link.setAttribute("rel", "icon");
  link.setAttribute("type", "image/png");
  link.href = url;
  document.head.appendChild(link);
}

export const getUserPlatform = (): 'Android' | 'iOS' | 'Web' => {
  const { userAgent, platform, maxTouchPoints } = navigator;
  const ua = userAgent || navigator.vendor || (window as any)?.opera;
  if (/android/i.test(ua)) return "Android";
  const isIOSRegex = /iPhone|iPad|iPod/i.test(ua);
  const isModerniPad = platform === 'MacIntel' && maxTouchPoints > 1;
  const isMSStream = !!(window as any)?.MSStream;
  if ((isIOSRegex || isModerniPad) && !isMSStream) return "iOS";
  return "Web";
}

export const formatNumber = (num: number) => { return Number((num).toFixed(2)).toLocaleString() }

export const generateQRCode = async (value: string) => {
  return await QRCode.toDataURL(value, {
    width: 800,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });
};