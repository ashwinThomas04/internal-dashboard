import { ToggleButtonProps } from "./cta";

const ToggleButton = ({
  isActive,
  onChange,
  id,
  disabled = false,
  className = "",
}: ToggleButtonProps) => {
  const handleClick = () => {
    if (!disabled && onChange) {
      onChange(!isActive);
    }
  };

  return (
    <button
      type="button"
      id={id}
      className={`qb-toggle-btn qb-border-solid-grey ${isActive ? "qb-toggle-active" : ""} ${className}`.trim()}
      onClick={handleClick}
      disabled={disabled}
      aria-pressed={isActive}
    />
  );
};

export default ToggleButton;