import { ChangeEvent, FocusEvent, useState } from "react";
import { I18nContent } from "../i18n";
import { TextInputProps } from "./input";
import { ErrorMessage } from "../alerts";

const TextInput = ({ label, error, disabled, name, id, prefix, suffix, placeholder, value, onBlur, onFocus, onChange, onSelect, ...rest }: TextInputProps) => {
    const [isFocused, setIsFocused] = useState(false);

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

    return (
        <div className={`qb-input-wrap w-100 d-flex flex-column align-items-stretch ${error ? "qb-input-error" : ""} ${disabled ? "qb-input-disabled" : ""} ${isFocused ? "qb-input-focused" : ""} ${value ? "qb-input-filled" : ""}`}>
            {
                label && typeof (label) === "string" ? <label htmlFor={name} className="qb-text-input-label qb-fs-paragraph-xs pb-1 qb-fw-semi-bold">{label}</label>
                    : label && typeof (label) === "object" ? <label htmlFor={name} className="qb-text-input-label qb-fs-paragraph-xs pb-1 qb-fw-semi-bold"><I18nContent en={label.en} es={label.es} fr={label.fr} /></label>
                        : null}
            <div className="qb-input-container qb-br-8 d-flex align-items-stretch">
                {
                    prefix && typeof (prefix) === "string" ? <div><div className="qb-input-prefix d-flex align-items-center h-100 qb-fs-paragraph-sm qb-fw-regular">{prefix}</div></div>
                        : prefix && typeof (prefix) === "object" ? <div><div className="qb-input-prefix d-flex align-items-center h-100 qb-fs-paragraph-sm qb-fw-regular"><I18nContent en={prefix.en} es={prefix.es} fr={prefix.fr} /></div></div>
                            : null}
                <div className="d-flex position-relative flex-fill">
                    <input value={value} onChange={handleInputChange} onFocus={handleInputFocus} onBlur={handleInputBlur} name={name} className="qb-text-input qb-br-8 w-100 qb-fs-paragraph-md qb-fw-regular" disabled={disabled} {...rest} />
                    {
                        placeholder && typeof (placeholder) === "string" ? <div className="qb-input-placeholder d-flex align-items-center h-100 qb-fs-paragraph-md qb-fw-regular">{placeholder}</div>
                            : placeholder && typeof (placeholder) === "object" ? <div className="qb-input-placeholder d-flex align-items-center h-100 qb-fs-paragraph-md qb-fw-regular"><I18nContent en={placeholder.en} es={placeholder.es} fr={placeholder.fr} /></div>
                                : null}
                </div>
                {
                    suffix && typeof (suffix) === "string" ? <div><div className="qb-input-suffix d-flex align-items-center h-100 qb-fs-paragraph-sm qb-fw-regular">{suffix}</div></div>
                        : suffix && typeof (suffix) === "object" ? <div><div className="qb-input-suffix d-flex align-items-center h-100 qb-fs-paragraph-sm qb-fw-regular"><I18nContent en={suffix.en} es={suffix.es} fr={suffix.fr} /></div></div>
                            : null}
            </div>
            {error ? <ErrorMessage className="pt-1">{error}</ErrorMessage> : null}
        </div>
    )
}

export default TextInput;