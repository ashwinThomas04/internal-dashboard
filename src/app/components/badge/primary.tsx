import { BadgeProps } from "./badge";

const Badge = ({ color = "primary", children, textSize = "tag", weight = "bold", size = "sm" }: BadgeProps) => {
  return (
    <div className={`qb-badge qb-br-48 d-flex align-items-center justify-content-center qb-badge-${color} ${size === "sm" ? "px-2 py-1" : size === "md" ? "px-3 py-2" : "px-4 py-3"}`}>
      <p className={`qb-fs-${textSize} qb-fw-${weight}`}>{children}</p>
    </div>
  )
}

export default Badge;