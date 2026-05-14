import { ReactNode } from "react";

interface SurfacePropsType {
    children: ReactNode,
    className?: string
    onClick?: () => void
}

interface PaperPropsType extends SurfacePropsType { }
interface CardPropsType extends SurfacePropsType { }

export type { PaperPropsType, CardPropsType }