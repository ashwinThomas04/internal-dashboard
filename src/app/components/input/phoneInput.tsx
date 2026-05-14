import { ChangeEvent, FocusEvent, useId, useMemo, useRef, useState } from "react";
import { I18nContent } from "../i18n";
import { CountryOptionComponentProps, PhoneInputProps } from "./input";
import { ErrorMessage } from "../alerts";

const viewportHeight = window.innerHeight;

const PhoneInput = ({ label, error, disabled, name, id, placeholder, selectedCountry, countryOptions = [], value, onBlur, onFocus, onChange, onCountrySelect, onKeyDown, ...rest }: PhoneInputProps) => {
    const idx = useId();
    const [isFocused, setIsFocused] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [openDirection, setOpenDirection] = useState("down");
    const [optionsHeight, setOptionsHeight] = useState(320);
    const [activeIndex, setActiveIndex] = useState(-1);
    const selectRef = useRef<HTMLDivElement | null>(null);

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

    const onOptionClick = (i: number) => {
        const val = countryOptions[i];
        if (onCountrySelect) onCountrySelect(val, id);
        toggleSelectBox();
        setActiveIndex(i);
    }

    const updateOptionsRendering = () => {
        if (selectRef.current) {
            let h = countryOptions.length * 36;
            h = h < optionsHeight ? h : optionsHeight;
            const { bottom } = selectRef.current.getBoundingClientRect();
            const sb = viewportHeight - bottom;

            const d = sb > (h + 32) ? "down" : "up";
            setOpenDirection(d);
        }
    }

    const toggleSelectBox = () => {
        if (disabled) return;
        let expanded = !isExpanded;
        updateOptionsRendering();
        setIsExpanded(expanded);
    }

    const returnSelectIcon = () => {
        if (isExpanded) return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 15L11.5 7.5L4 15" stroke="#8B9AB1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
        else return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.5 9L12 16.5L4.5 9" stroke="#8B9AB1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
    }

    const selectIcon = useMemo(returnSelectIcon, [isExpanded]);

    return (
        <div className={`qb-input-wrap qb-phone-input-wrap w-100 d-flex flex-column align-items-stretch position-relative ${error ? "qb-input-error" : ""} ${disabled ? "qb-input-disabled" : ""} ${isFocused ? "qb-input-focused" : ""} ${value ? "qb-input-filled" : ""}`}>
            {
                label && typeof (label) === "string" ? <label htmlFor={name} className="qb-text-input-label qb-fs-paragraph-xs pb-1 qb-fw-semi-bold">{label}</label>
                    : label && typeof (label) === "object" ? <label htmlFor={name} className="qb-text-input-label qb-fs-paragraph-xs pb-1 qb-fw-semi-bold"><I18nContent en={label.en} es={label.es} fr={label.fr} /></label>
                        : null}
            <div className="qb-input-container qb-br-8 d-flex align-items-stretch">

                <div
                    ref={selectRef}
                    className={`qb-input-prefix d-flex align-items-center h-100 qb-fs-paragraph-sm qb-fw-regular qb-cursor-pointer ${isExpanded ? "qb-input-prefix-expanded" : ""}`}
                    onClick={toggleSelectBox}
                    role="button"
                >
                    <span className="pe-2 d-flex">{selectedCountry?.code || selectedCountry?.value}</span>
                    <div className="d-flex align-items-center justify-content-center">
                        {selectIcon}
                    </div>
                </div>

                <div className="d-flex position-relative flex-fill">
                    <input type="tel" value={value} onChange={handleInputChange} onFocus={handleInputFocus} onBlur={handleInputBlur} name={name} className="qb-text-input qb-br-8 w-100 qb-fs-paragraph-md qb-fw-regular" disabled={disabled} {...rest} />
                    {
                        placeholder && typeof (placeholder) === "string" ? <div className="qb-input-placeholder d-flex align-items-center h-100 qb-fs-paragraph-md qb-fw-regular">{placeholder}</div>
                            : placeholder && typeof (placeholder) === "object" ? <div className="qb-input-placeholder d-flex align-items-center h-100 qb-fs-paragraph-md qb-fw-regular"><I18nContent en={placeholder.en} es={placeholder.es} fr={placeholder.fr} /></div>
                                : null}
                </div>
            </div>

            <div className={`position-absolute w-100 qb-select-option-wrap qb-shadow-sm qb-br-8 qb-z-select qb-select-option-${openDirection} ${isExpanded ? " qb-select-options-expanded" : ""}`}>
                <div className="qb-select-option-container p-1" style={{ maxHeight: `${optionsHeight}px` }}>
                    <div className="qb-select-option-content">
                        {
                            countryOptions.map((option, i) => <SelectOptionComponent data={option} index={i} selected={selectedCountry} key={`phone-option-${id ? id : idx}-${i}`} isMultiLine={false} activeIndex={activeIndex} onOptionClick={onOptionClick} />)
                        }
                    </div>
                </div>
            </div>

            {error ? <ErrorMessage className="pt-1">{error}</ErrorMessage> : null}
        </div>
    )
}

const SelectOptionComponent = ({ data, selected, index, isMultiLine, activeIndex, onOptionClick }: CountryOptionComponentProps) => {

    const onClick = () => {
        onOptionClick(index);
    }

    const checkSelected = () => {
        if (selected?.value === data.value) return true;
        else return false;
    }

    const checkFocused = () => {
        if (index === activeIndex) return true;
        else return false;
    }

    const isFocused = useMemo(checkFocused, [activeIndex]);
    const isSelected = useMemo(checkSelected, [selected]);

    return (
        <>
            {index === 0 ? null : <div className="qb-horizontal-breaker"><span></span></div>}
            <div className={`qb-select-option qb-cursor-pointer qb-br-4 p-2${isSelected ? " qb-selected-option" : ""}${isMultiLine ? "" : " qb-text-truncate"}${isFocused ? " qb-select-option-focused" : ""}`} data-label={data.label} data-value={data.value} role="button" onClick={onClick}>
                {data.label}<span className={`qb-fs-paragraph-xs ps-1 ${isSelected ? "qb-text-light" : "qb-text-muted"}`}>{data.code}</span>
            </div>
        </>
    )
}

export default PhoneInput;
