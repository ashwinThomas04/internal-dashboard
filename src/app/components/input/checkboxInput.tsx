import { ChangeEvent, useId } from "react";
import { I18nContent } from "../i18n";
import { CheckboxInputProps } from "./input";
import { ErrorMessage } from "../alerts";

const CheckboxInput = ({ label, error, disabled, name, id, checked, onChange, className = "", ...rest }: CheckboxInputProps) => {
    const generatedId = useId();
    const inputId = id ?? name ?? generatedId;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (onChange) onChange(e.target.checked, id);
    };

    return (
        <div
            className={`qb-checkbox-wrap d-flex flex-column align-items-stretch ${error ? "qb-input-error" : ""} ${disabled ? "qb-input-disabled" : ""} ${className}`}
        >
            <label
                htmlFor={inputId}
                className={`qb-checkbox-label d-flex align-items-center qb-cursor-pointer ${disabled ? "qb-cursor-not-allowed" : ""}`}
            >
                <span className={`qb-checkbox-box d-flex align-items-center justify-content-center flex-shrink-0 qb-br-4 ${checked ? "qb-checkbox-checked" : ""}`}>
                    {checked && (
                        <svg
                            className="qb-checkbox-tick"
                            width="10"
                            height="8"
                            viewBox="0 0 10 8"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path
                                d="M1 3.5L3.8 6.5L9 1"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    )}
                </span>
                <input
                    id={inputId}
                    name={name}
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={handleChange}
                    className="qb-checkbox-input"
                    aria-checked={checked}
                    aria-disabled={disabled}
                    aria-describedby={error ? `${inputId}-error` : undefined}
                    {...rest}
                />
                {label && typeof label === "string" ? (
                    <span className="qb-checkbox-label-text qb-fs-paragraph-sm qb-fw-regular ps-2">{label}</span>
                ) : label && typeof label === "object" ? (
                    <span className="qb-checkbox-label-text qb-fs-paragraph-sm qb-fw-regular ps-2">
                        <I18nContent en={label.en} es={label.es} fr={label.fr} />
                    </span>
                ) : null}
            </label>
            {error ? <ErrorMessage className="pt-1">{error}</ErrorMessage> : null}
        </div>
    );
};

export default CheckboxInput;
