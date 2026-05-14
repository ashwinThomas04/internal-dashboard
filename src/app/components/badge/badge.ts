import { ReactNode } from "react";
import { FontSizingType, FontWieghtType, AppColorThemeType } from "../../types";

export type BadgeProps = {
  color?: AppColorThemeType;
  children: ReactNode;
  textSize?: FontSizingType;
  weight?: FontWieghtType;
  size?: "sm" | "md" | "lg";
}