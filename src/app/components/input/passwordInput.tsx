import { ChangeEvent, FocusEvent, useMemo, useState } from "react";
import { I18nContent } from "../i18n";
import { PasswordInputProps } from "./input";
import { ErrorMessage, InfoMessage } from "../alerts";

const PasswordInput = ({ label, error, disabled, name, id, info, placeholder, value, onBlur, onFocus, onChange, type, ...rest }: PasswordInputProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordShown, setIsPasswordShown] = useState(false);

    const handleInputFocus = (e: FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        if (onFocus) onFocus(e);
    }

    const handleInputBlur = (e: FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        if (onBlur) onBlur(e);
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e?.target?.value;
        if (onChange) onChange(val, id);
    }

    const togglePasswordVisibility = () => {
        let visibility = !isPasswordShown;
        setIsPasswordShown(visibility);
    }

    const returnInputType = () => {
        return isPasswordShown ? "text" : "password";
    }

    const returnPasswordicon = () => {
        if (isPasswordShown) return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5.24951C4.5 5.24951 1.5 12.0002 1.5 12.0002C1.5 12.0002 4.5 18.7495 12 18.7495C19.5 18.7495 22.5 12.0002 22.5 12.0002C22.5 12.0002 19.5 5.24951 12 5.24951Z" stroke="#8B9AB1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25C9.92893 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92893 15.75 12 15.75Z" stroke="#8B9AB1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
        else return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 3.75L19.5 20.25" stroke="#8B9AB1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M14.5226 14.7747C13.7866 15.4436 12.8151 15.7928 11.8217 15.7454C10.8284 15.6981 9.89446 15.2581 9.22548 14.5222C8.5565 13.7863 8.20723 12.8149 8.25448 11.8215C8.30174 10.8281 8.74167 9.89414 9.47749 9.2251" stroke="#8B9AB1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M6.93698 6.43066C3.11486 8.36618 1.5 12 1.5 12C1.5 12 4.5 18.7493 12 18.7493C13.7572 18.7633 15.4926 18.3585 17.0623 17.5685" stroke="#8B9AB1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M19.5571 15.8528C21.6011 14.0222 22.5 11.9998 22.5 11.9998C22.5 11.9998 19.5 5.24904 12 5.24904C11.3504 5.24798 10.7019 5.30079 10.061 5.40693" stroke="#8B9AB1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M12.7057 8.31641C13.5027 8.46946 14.2287 8.8768 14.7746 9.47735C15.3205 10.0779 15.657 10.8393 15.7336 11.6472" stroke="#8B9AB1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
    }

    const inputType = useMemo(returnInputType, [isPasswordShown]);
    const passwordIcon = useMemo(returnPasswordicon, [isPasswordShown]);

    return (
        <div className={`qb-input-wrap w-100 d-flex flex-column align-items-stretch ${error ? "qb-input-error" : ""} ${disabled ? "qb-input-disabled" : ""} ${isFocused ? "qb-input-focused" : ""} ${value ? "qb-input-filled" : ""}`}>
            {
                label && typeof (label) === "string" ? <label htmlFor={name} className="qb-text-input-label qb-fs-paragraph-xs pb-1 qb-fw-semi-bold">{label}</label>
                    : label && typeof (label) === "object" ? <label htmlFor={name} className="qb-text-input-label qb-fs-paragraph-xs pb-1 qb-fw-semi-bold"><I18nContent en={label.en} es={label.es} fr={label.fr} /></label>
                        : null}
            <div className="qb-input-container qb-br-8 d-flex">
                <div className="d-flex position-relative flex-fill">
                    <input value={value} type={inputType} onChange={handleInputChange} onFocus={handleInputFocus} onBlur={handleInputBlur} name={name} className="qb-text-input qb-br-8 w-100 qb-fs-paragraph-md qb-fw-regular" disabled={disabled} {...rest} />
                    {
                        placeholder && typeof (placeholder) === "string" ? <div className="qb-input-placeholder d-flex align-items-center h-100 qb-fs-paragraph-md qb-fw-regular">{placeholder}</div>
                            : placeholder && typeof (placeholder) === "object" ? <div className="qb-input-placeholder d-flex align-items-center h-100 qb-fs-paragraph-md qb-fw-regular"><I18nContent en={placeholder.en} es={placeholder.es} fr={placeholder.fr} /></div>
                                : null}
                </div>
                {disabled ? null : <div className="d-flex align-items-stretch"><div className="qb-input-suffix-svg-btn d-flex align-items-center justify-content-center" role="button" tabIndex={0} onClick={togglePasswordVisibility}>{passwordIcon}</div></div>}
            </div>
            {info ? <InfoMessage className="pt-1">{info}</InfoMessage> : null}
            {error ? <ErrorMessage className="pt-1">{error}</ErrorMessage> : null}
        </div>
    )
}

export default PasswordInput;