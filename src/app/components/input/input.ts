type InputBoxType = "text" | "password" | "search" | "select" | "phone" | "checkbox";
interface I18nTextObject {
    en: string;
    es?: string | undefined;
    fr?: string | undefined;
}
interface SelectOption {
    label: string | number,
    value: string | number
}
interface CountryOption {
    label: string | number,
    value: string | number,
    code?: string
}
interface SelectOptionComponentProps {
    data: SelectOption,
    selected: SelectOption,
    isMultiLine: boolean,
    activeIndex: number,
    index: number,
    onOptionClick: (index: number) => void
}
interface CountryOptionComponentProps {
    data: CountryOption,
    selected: CountryOption,
    isMultiLine: boolean,
    activeIndex: number,
    index: number,
    onOptionClick: (index: number) => void
}
interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix" | "placeholder" | "onChange"> {
    index?: number | undefined,
    id?: string | undefined,
    label?: I18nTextObject | string;
    error?: string | undefined;
    prefix?: string | I18nTextObject | undefined;
    suffix?: string | I18nTextObject | undefined;
    placeholder?: string | I18nTextObject | undefined;
    onChange?: (value: string, id?: string | undefined) => void;
    onClear?: (id?: string | undefined) => void;
    onSearch?: (value?: string | number | readonly string[] | undefined, id?: string | undefined) => void;
}
interface PasswordInputProps extends Omit<TextInputProps, "prefix" | "suffix"> {
    info?: string | null
}
interface SearchInputProps extends Omit<TextInputProps, "prefix" | "suffix"> { }
interface SelectInputProps extends Omit<TextInputProps, "prefix" | "suffix" | "onSelect"> {
    isSearchable: boolean,
    selected: SelectOption,
    options: SelectOption[],
    isInputAllowed: boolean,
    isOptionMultiLine?: boolean,
    onSelect?: (val: SelectOption, id?: string | undefined) => void
}
interface PhoneInputProps extends Omit<TextInputProps, "prefix" | "suffix" | "onSelect"> {
    selectedCountry: CountryOption,
    countryOptions: CountryOption[],
    onCountrySelect?: (val: CountryOption, id?: string | undefined) => void
}
interface CheckboxInputProps {
    id?: string | undefined;
    name?: string | undefined;
    label?: I18nTextObject | string;
    checked?: boolean;
    disabled?: boolean;
    error?: string | undefined;
    onChange?: (checked: boolean, id?: string | undefined) => void;
    className?: string;
}
interface InputBoxProps extends Omit<PhoneInputProps, "prefix" | "suffix" | "onSelect"> {
    inputType: InputBoxType,
    selected: SelectOption,
    options: SelectOption[],
    isInputAllowed: boolean,
}

export type { TextInputProps, PasswordInputProps, SearchInputProps, InputBoxProps, SelectInputProps, PhoneInputProps, CheckboxInputProps, SelectOptionComponentProps, CountryOptionComponentProps, InputBoxType, CountryOption };