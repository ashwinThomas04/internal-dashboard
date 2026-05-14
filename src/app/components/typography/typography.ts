import { ReactNode } from "react";
import { AlignTextType, AppColorThemeType, FontSizingType, FontWieghtType } from "../../types";

interface HeadingWrapperProps{
    children:ReactNode;
    className?:string;
    headingType?:"h1"|"h2"|"h3"|"h4"|"h5"|"h6";
}

interface ContentWrapperProps{
    children:ReactNode;
    className?:string;
}

interface TextProps{
    children:ReactNode;
    es?:ReactNode|undefined;
    fr?:ReactNode|undefined;
    className?:string;
    type?:"heading"|"content";
    headingType?:"h1"|"h2"|"h3"|"h4"|"h5"|"h6";
    weight?:FontWieghtType;
    size?:FontSizingType;
    align?:AlignTextType; 
    color?:AppColorThemeType;
}

export type { TextProps, HeadingWrapperProps, ContentWrapperProps }