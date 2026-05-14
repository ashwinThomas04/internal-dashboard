import { ChangeEvent, FocusEvent, useState } from "react";
import { I18nContent } from "../i18n";
import { SearchInputProps } from "./input";
import { ErrorMessage } from "../alerts";

const SearchInput = ({ label, error, disabled, name, id, placeholder, value, type, onBlur, onFocus, onChange, onClear, onSearch, ...rest }: SearchInputProps) => {
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

    const handleClearClick = () => {
        if (onClear) onClear(id);
    }

    const handleSearchClick = () => {
        if (onSearch) onSearch(value, id);
    }

    return (
        <div className={`qb-input-wrap qb-search-input-wrap w-100 d-flex flex-column align-items-stretch ${error ? "qb-input-error" : ""} ${disabled ? "qb-input-disabled" : ""} ${isFocused ? "qb-input-focused" : ""} ${value ? "qb-input-filled" : ""}`}>
            {
                label && typeof (label) === "string" ? <label htmlFor={name} className="qb-text-input-label qb-fs-paragraph-xs pb-1 qb-fw-semi-bold">{label}</label>
                    : label && typeof (label) === "object" ? <label htmlFor={name} className="qb-text-input-label qb-fs-paragraph-xs pb-1 qb-fw-semi-bold"><I18nContent en={label.en} es={label.es} fr={label.fr} /></label>
                        : null}
            <div className="qb-input-container qb-br-8 d-flex align-items-stretch">
                <div className="d-flex position-relative flex-fill">
                    <input value={value} onChange={handleInputChange} onFocus={handleInputFocus} onBlur={handleInputBlur} name={name} className="qb-text-input qb-br-8 w-100 qb-fs-paragraph-md qb-fw-regular" disabled={disabled} {...rest} />
                    {
                        placeholder && typeof (placeholder) === "string" ?
                            <div className="qb-input-placeholder d-flex align-items-center h-100 qb-fs-paragraph-md qb-fw-regular">
                                <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.75 15.75L12.4875 12.4875M14.25 8.25C14.25 11.5637 11.5637 14.25 8.25 14.25C4.93629 14.25 2.25 11.5637 2.25 8.25C2.25 4.93629 4.93629 2.25 8.25 2.25C11.5637 2.25 14.25 4.93629 14.25 8.25Z" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                {placeholder}
                            </div>
                            : placeholder && typeof (placeholder) === "object" ?
                                <div className="qb-input-placeholder d-flex align-items-center h-100 qb-fs-paragraph-md qb-fw-regular">
                                    <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15.75 15.75L12.4875 12.4875M14.25 8.25C14.25 11.5637 11.5637 14.25 8.25 14.25C4.93629 14.25 2.25 11.5637 2.25 8.25C2.25 4.93629 4.93629 2.25 8.25 2.25C11.5637 2.25 14.25 4.93629 14.25 8.25Z" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <I18nContent en={placeholder.en} es={placeholder.es} fr={placeholder.fr} />
                                </div>
                                : null}
                </div>
                {
                    value ?
                        <div className="qb-input-search-cta-wrapper d-flex align-items-stretch p-1">
                            <div className="qb-icon-btn qb-br-6 d-flex align-items-center justify-content-center qb-remove-icon-btn" role="button" tabIndex={0} onClick={handleClearClick}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.75 5.25L5.25 18.75" stroke="#0F1114" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M18.75 18.75L5.25 5.25" stroke="#0F1114" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <div className="ps-1 d-flex align-items-stretch">
                                <div className="qb-icon-btn qb-br-6 qb-primary-icon-btn d-flex align-items-center justify-content-center" role="button" tabIndex={0} onClick={handleSearchClick}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10.875 18.75C15.2242 18.75 18.75 15.2242 18.75 10.875C18.75 6.52576 15.2242 3 10.875 3C6.52576 3 3 6.52576 3 10.875C3 15.2242 6.52576 18.75 10.875 18.75Z" stroke="#0F1114" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M16.4431 16.4438L20.9994 21.0002" stroke="#0F1114" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        : null
                }
            </div>
            {error ? <ErrorMessage className="pt-1">{error}</ErrorMessage> : null}
        </div>
    )
}

export default SearchInput;