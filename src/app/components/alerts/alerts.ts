import { ReactNode } from "react";
import { AppColorThemeType } from "../../types";

type ToastType="SUCCESS"|"ERROR"|"WARNING"|"INFO";
interface AlertMessageProps{
    children:ReactNode,
    className?:string,
}

interface AlertIconProps{
    color?:AppColorThemeType
}

interface AlertsContextType{
    triggerToast:(title: string, message: string, type?: ToastType, duration?: number)=>void,
    removeToast:(id:string)=>void
}

interface ToastContentType{
    id:string,
    title:string,
    message:string,
    type:ToastType,
    duration:number
}

export type { AlertMessageProps, AlertIconProps, AlertsContextType, ToastContentType,ToastType }