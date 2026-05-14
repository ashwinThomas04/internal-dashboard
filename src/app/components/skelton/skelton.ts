import type { CSSProperties } from "react";
import { FontSizingType } from "../../types";

export interface SkeltonBase{
    animate?:boolean;
    style?:CSSProperties,
    className?:string,
}

export interface SkeltonTextProps extends SkeltonBase{
    size?:FontSizingType;
    rows?:number;
}