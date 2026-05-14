import { Text } from "../typography";
import { BadgeProps } from "./badge";

const GhostBadge = ({ color = "dark", children, textSize = "tag", weight = "bold", size = "sm" }: BadgeProps) => {
  return (
    <div className={`qb-br-48 d-flex align-items-center qb-bg-white qb-border-solid-${color} ${size === "sm" ? "px-2 py-1" : size === "md" ? "px-3 py-2" : "px-4 py-3"}`}>
      <Text weight={weight} size={textSize} color={color}>{children}</Text>
    </div>
  )
}

export default GhostBadge;