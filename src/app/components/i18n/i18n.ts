import { ReactNode } from "react";

interface I18nType{
    en:ReactNode;
    es?:ReactNode|undefined;
    fr?:ReactNode|undefined;
}

export type { I18nType }