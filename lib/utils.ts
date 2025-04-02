import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ParsedPhoneNumber } from "./types";
import { PhoneNumberUtil, RegionCode } from "google-libphonenumber";
import { CountryCode, CountryCodeList } from "react-native-country-picker-modal";

const phoneUtil = PhoneNumberUtil.getInstance();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const withTimeout = <T>(promise: Promise<T>, timeoutMs = 5000, fallback: T): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((resolve) =>
      setTimeout(() => resolve(fallback), timeoutMs)
    ),
  ]);
};


// parses a full phone number into its country code and national number
export const parsePhoneNumber = (fullNumber: string): ParsedPhoneNumber => {
  try {
    const parsedNumber = phoneUtil.parse(fullNumber);
    const regionCode = phoneUtil.getRegionCodeForNumber(
      parsedNumber
    ) as RegionCode;

    return {
      country: isValidCountryCode(regionCode) ? regionCode : "US",
      nationalNumber:
        parsedNumber.getNationalNumber()?.toString() ||
        fullNumber.replace(/\D/g, ""),
    };
  } catch {
    return {
      country: "US",
      nationalNumber: fullNumber.replace(/\D/g, ""),
    };
  }
};

const isValidCountryCode = (code: string): code is CountryCode => {
  return CountryCodeList.includes(code as CountryCode);
};

export const truncateAddress = (
  address: string,
  { prefix = 8, suffix = 4 }: { prefix?: number; suffix?: number } = {}
) => {
  return `${address.slice(0, prefix)}•••${address.slice(-suffix)}`;
};
