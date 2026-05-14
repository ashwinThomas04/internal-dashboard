import { Link } from "react-router";
import { I18nContent } from "../i18n";
import { DisabledLinkProps, TextLinkComponentProps, TextLinkProps } from "./cta";

const DisabledInline = ({ children, ...rest }: DisabledLinkProps) => <span aria-disabled="true" {...rest}>{children}</span>;
const Anchor = ({ children, isActive, isLoading, to, ...rest }: TextLinkComponentProps) => <a href={to} {...rest}>{children}</a>;
const RouterLink = ({ children, isActive, isLoading, to, ...rest }: TextLinkComponentProps) => <Link to={to} {...rest}>{children}</Link>

const TextLinkMap = { "anchor": Anchor, "router": RouterLink };

const TextLink = ({ as = "anchor", id, children, es, fr, to, color = "primary", align = "inherit", isActive = true, isLoading, size = "md", weight = "bold", className = "", onClick, onDisabledClick, ...rest }: TextLinkProps) => {
    const classNames = `position-relative qb-link qb-text-${color} qb-fs-paragraph-${size} mb-0 text-${align} qb-fw-${weight} ${className} ${isActive ? "" : "qb-link-disabled"} ${isLoading ? "qb-link-loading" : ""}`;
    const disabled = !isActive || isLoading;
    const TextLinkChild = TextLinkMap[as];

    const handleButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (onClick && e) {
            e.preventDefault();
            if (!disabled) onClick(to, id, e);
            else if (disabled && onDisabledClick) onDisabledClick(to, id, e);
        }
    }

    if (disabled) { return <DisabledInline className={classNames} onClick={handleButtonClick}><I18nContent en={children} es={es} fr={fr} /></DisabledInline> }
    return (
        <TextLinkChild to={to} onClick={handleButtonClick} className={classNames} {...rest}>
            <I18nContent en={children} es={es} fr={fr} />
        </TextLinkChild>
    )
}

export default TextLink;