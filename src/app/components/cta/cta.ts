import { ReactNode } from "react";
import { AppColorThemeType, AlignTextType, FontWieghtType } from "../../types";

type ButtonSize="lg"|"md"|"sm"
interface ButtonWrapperProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{}

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>,"onClick"> {
    es?:ReactNode|undefined;
    fr?:ReactNode|undefined;
    size?:ButtonSize;
    id?:string|undefined;
    isActive?:boolean;
    isLoading?:boolean;
    onClick?:(id:string|undefined,e:React.MouseEvent<HTMLButtonElement>)=>void;
    onDisabledClick?:(id:string|undefined,e:React.MouseEvent<HTMLButtonElement>)=>void;
}

interface TextLinkComponentProps extends Omit<React.LinkHTMLAttributes<HTMLAnchorElement>,"onClick">{
    children:ReactNode;
    to:string;
    className?:string;
    isActive?:boolean;
    isLoading?:boolean;
    onClick?:(e:React.MouseEvent<HTMLAnchorElement>)=>void;
}

interface DisabledLinkProps{
    className: string
    onClick?: (e: React.MouseEvent<any>) => void
    children: ReactNode
}

interface TextLinkProps extends Omit<React.LinkHTMLAttributes<HTMLAnchorElement>,"onClick">{
    as:"anchor"|"router";
    children:ReactNode;
    es?:ReactNode|undefined;
    fr?:ReactNode|undefined;
    to:string;
    className?:string;
    weight?:FontWieghtType;
    size?:ButtonSize;
    align?:AlignTextType; 
    color?:AppColorThemeType;
    id?:string|undefined;
    isActive?:boolean;
    isLoading?:boolean;
    onClick?:(to:string|undefined,id:string|undefined,e:React.MouseEvent<HTMLAnchorElement>)=>void;
    onDisabledClick?:(to:string|undefined,id:string|undefined,e:React.MouseEvent<HTMLAnchorElement>)=>void;
}

interface ToggleButtonProps {
    isActive: boolean;
    onChange: (isActive: boolean) => void;
    id?: string;
    disabled?: boolean;
    className?: string;
}

export type { ButtonProps, ButtonWrapperProps, TextLinkProps, TextLinkComponentProps, DisabledLinkProps, ToggleButtonProps };