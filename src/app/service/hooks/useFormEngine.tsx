import { useState, useCallback, useMemo } from 'react';
import services from '../index';
import { InputBoxType } from '../../components/input/input';

type FieldSchema = {
    type: InputBoxType;
    isRequired?: boolean;
    defaultValue?: any;
    isHidden?: boolean;
    isDisabled?: boolean;
    emptyErrorMessage?: string;
    validation?: { min?: number, max?: number, pattern?: string, label: string } | ((value: any) => { isValid: boolean, message: string });
};

type FormSchema = Record<string, FieldSchema>;

type FormState = {
    values: Record<string, any>;
    dropdowns: Record<string, any>;
    errors: Record<string, string>;
};

type FormOverrides = {
    visibility: Record<string, boolean>;
    disabled: Record<string, boolean>;
    options: Record<string, Record<string, any>[]>;
};

type FormEngine = {
    values: Record<string, any>;
    errors: Record<string, string>;
    dropdowns: Record<string, any>;
    options: Record<string, Record<string, any>[]>;
    disabled: Record<string, boolean>;
    visibility: Record<string, boolean | undefined>;
    isComplete: boolean;

    setField: (field: string, value: any) => void;
    setFields: (fields: Record<string, any>) => void;
    setErrors: (errors: Record<string, string>) => void;
    setVisibility: (fields: Record<string, boolean>) => void;
    setDisabled: (fields: Record<string, boolean>) => void;
    handleValidation: () => boolean;
    updateDropdown: (key: string, dropdown: Record<string, any>) => void;
    updateDropdowns: (dropdowns: Record<string, Record<string, any>>) => void;
    updateOptions: (options: Record<string, Record<string, any>[]>) => void;
    validateRequiredFields: () => void;
    getCleanedValues: () => Record<string, any>;
    resetForm: () => void;
};

const useFormEngine = (schema: FormSchema, selectOptions?: Record<string, Record<string, any>[]>): FormEngine => {
    const cloneValues = (values: Record<string, any>) => ({ ...values });

    const cloneErrors = (errors: Record<string, string>) => ({ ...errors });

    const cloneDropdowns = (dropdowns: Record<string, any>) => {
        const next: Record<string, any> = {};
        Object.keys(dropdowns).forEach(key => {
            next[key] = dropdowns[key] ? { ...dropdowns[key] } : null;
        });
        return next;
    };

    const cloneOptions = (options: Record<string, Record<string, any>[]>) => {
        const next: Record<string, Record<string, any>[]> = {};
        Object.keys(options).forEach(key => {
            next[key] = options[key] ? options[key].map(item => ({ ...item })) : [];
        });
        return next;
    };

    const cloneVisibility = (visibility: Record<string, boolean>) => ({ ...visibility });

    const cloneDisabled = (disabled: Record<string, boolean>) => ({ ...disabled });

    const cloneFormState = (state: FormState): FormState => ({
        values: cloneValues(state.values),
        dropdowns: cloneDropdowns(state.dropdowns),
        errors: cloneErrors(state.errors)
    });

    const getInitialValues = useMemo(() => {
        const value: Record<string, any> = {}, disabled: Record<string, boolean> = {}, visibility: Record<string, boolean> = {}, errors: Record<string, string> = {}, dropdowns: Record<string, any> = {}, options: Record<string, Record<string, any>[]> = {};
        Object.keys(schema).forEach(key => {
            const field = schema[key];
            value[key] = field.defaultValue && (typeof field.defaultValue === "string" || typeof field.defaultValue === "boolean" || typeof field.defaultValue === "number") ? field.defaultValue : "";
            disabled[key] = field.isDisabled === undefined ? false : field.isDisabled;
            visibility[key] = field.isHidden === undefined ? true : !field.isHidden;
            errors[key] = '';
            if (field.type === "select" || field.type === "search" || field.type === "phone") {
                dropdowns[key] = field.defaultValue && typeof field.defaultValue === "object" ? { ...field.defaultValue } : null;
                options[key] = selectOptions?.[key] ? [...selectOptions[key]] : [];
                if (field.type != "phone") value[key] = field.defaultValue && typeof field.defaultValue === "object" ? field.defaultValue.label : field.defaultValue && typeof field.defaultValue === "string" ? field.defaultValue : "";
            }
        });
        return { value, disabled, visibility, errors, dropdowns, options }
    }, [schema, selectOptions]);

    const [state, setState] = useState<FormState>({
        values: getInitialValues.value,
        dropdowns: getInitialValues.dropdowns,
        errors: getInitialValues.errors,
    });
    const [overrides, setOverrides] = useState<FormOverrides>({
        visibility: getInitialValues.visibility,
        disabled: getInitialValues.disabled,
        options: getInitialValues.options
    });

    const setField = useCallback((field: string, value: any) => {
        setState(prevState => {
            if (prevState.values[field] === value) return prevState;
            return {
                ...prevState,
                values: { ...prevState.values, [field]: value },
                errors: { ...prevState.errors, [field]: "" }
            }
        })
    }, []);

    const setFields = useCallback((fields: Record<string, any>) => {
        setState(prevState => {
            return {
                ...prevState,
                values: { ...prevState.values, ...fields },
            }
        })
    }, []);

    const setErrors = useCallback((errors: Record<string, string>) => {
        setState(prevState => {
            return {
                ...prevState,
                errors: { ...prevState.errors, ...errors }
            }
        })
    }, []);

    const setVisibility = useCallback((fields: Record<string, boolean>) => {
        setOverrides(prevState => {
            return {
                ...prevState,
                visibility: { ...prevState.visibility, ...fields }
            }
        })
    }, []);

    const setDisabled = useCallback((fields: Record<string, boolean>) => {
        setOverrides(prevState => {
            return {
                ...prevState,
                disabled: { ...prevState.disabled, ...fields }
            }
        })
    }, []);

    const updateDropdown = useCallback((key: string, dropdown: Record<string, any>) => {
        setState(prevState => {
            return {
                ...prevState,
                dropdowns: {
                    ...prevState.dropdowns,
                    [key]: { ...dropdown }
                },
                values: schema[key].type === "phone" ? { ...prevState.values } : { ...prevState.values, [key]: dropdown?.label ? dropdown.label : "" }
            }
        })
    }, [schema]);

    const updateDropdowns = useCallback((dropdowns: Record<string, Record<string, any>>) => {
        setState(prevState => {
            const next = cloneFormState(prevState);
            Object.keys(dropdowns).forEach(key => {
                next.dropdowns[key] = dropdowns[key] ? { ...dropdowns[key] } : null;
                if (schema[key]?.type !== "phone") {
                    next.values[key] = dropdowns[key]?.label ?? "";
                }
            });
            return next;
        });
    }, [schema]);

    const updateOptions = useCallback((options: Record<string, Record<string, any>[]>) => {
        setOverrides((prev) => {
            return {
                ...prev,
                options: {
                    ...prev.options,
                    ...options
                }
            }
        })
    }, []);

    const resetForm = useCallback(() => {
        setState({
            values: cloneValues(getInitialValues.value),
            dropdowns: cloneDropdowns(getInitialValues.dropdowns),
            errors: cloneErrors(getInitialValues.errors)
        });

        setOverrides({
            visibility: cloneVisibility(getInitialValues.visibility),
            disabled: cloneDisabled(getInitialValues.disabled),
            options: cloneOptions(getInitialValues.options)
        });
    }, [getInitialValues]);

    const validateRequiredFields = useCallback(() => {
        const errors: Record<string, string> = {}
        Object.keys(schema).forEach(key => {
            const field = schema[key];
            if (!overrides.visibility[key] || !field.isRequired) return;
            else if ((field.type === "text" || field.type === "phone" || field.type === "password") && (!state.values[key] || (typeof (state.values[key]) === "string" && state.values[key].trim() === ""))) {
                errors[key] = schema[key].emptyErrorMessage || services.messageService.getEmptyFieldError("field");
            }
            else if ((field.type === "select" || field.type === "search") && (!state.dropdowns[key] || !state.dropdowns[key].label)) {
                errors[key] = schema[key].emptyErrorMessage || services.messageService.getEmptyFieldError("field");
            }
            else if (field.isRequired && field.type === "checkbox" && (!state.values[key])) {
                errors[key] = schema[key].emptyErrorMessage || services.messageService.getEmptyFieldError("field");
            }
        });
        setState(prevState => {
            return {
                ...prevState,
                errors
            }
        })
    }, [schema, state.values, overrides.visibility, state.dropdowns]);


    const validationBuilder = (field: FieldSchema, value: any) => {
        if (typeof (field.validation) === "object") {
            const { min, max, pattern, label } = field.validation;
            if (max && typeof value === "string" && value.length > max) return { isValid: false, message: `${label} is too long! Please enter a valid ${label}` };
            if (min && typeof value === "string" && value.length < min) return { isValid: false, message: `${label} is too short! Please enter a valid ${label}` };
            if (pattern) {
                try {
                    const regex = new RegExp(pattern);
                    if (!regex.test(value)) {
                        return { isValid: false, message: `${label} is invalid! Please enter a valid ${label}` };
                    }
                } catch {
                    return { isValid: false, message: `${label} format is invalid` };
                }
            }
            return { isValid: true };
        }
        return { isValid: true, message: "" }
    }

    const handleValidation = useCallback(() => {
        const errors: Record<string, string> = {}; let isValid = true;
        Object.keys(schema).forEach(key => {
            const field = schema[key];
            if (!overrides.visibility[key]) return;
            else if (field.isRequired && (field.type === "text" || field.type === "phone" || field.type === "password") && (!state.values[key] || (typeof (state.values[key]) === "string" && state.values[key].trim() === ""))) {
                errors[key] = schema[key].emptyErrorMessage || services.messageService.getEmptyFieldError("field");
                isValid = false;
            }
            else if (field.isRequired && ((field.type === "select" || field.type === "search") && (!state.dropdowns[key] || !state.dropdowns[key].label))) {
                errors[key] = schema[key].emptyErrorMessage || services.messageService.getEmptyFieldError("field");
                isValid = false;
            }
            else if (field.isRequired && field.type === "checkbox" && (!state.values[key])) {
                errors[key] = schema[key].emptyErrorMessage || services.messageService.getEmptyFieldError("field");
                isValid = false;
            }
            else if (field.validation && typeof (field.validation) === "function" && state.values[key] && (typeof (state.values[key]) != "string" || state.values[key].trim() !== "")) {
                const validationResponse = field.validation(state.values[key]);
                if (!validationResponse.isValid) {
                    errors[key] = validationResponse.message;
                    isValid = false;
                }
            }
            else if (field.validation && typeof (field.validation) === "object" && state.values[key] && (typeof (state.values[key]) != "string" || state.values[key].trim() !== "")) {
                const validationResponse = validationBuilder(field, state.values[key]);
                if (!validationResponse.isValid) {
                    errors[key] = validationResponse.message ? validationResponse.message : "";
                    isValid = false;
                }
            }
        });
        setState(prevState => {
            return {
                ...prevState,
                errors
            }
        });
        return isValid;
    }, [schema, state.values, overrides.visibility, state.dropdowns]);

    const getCleanedValues = () => {
        const values: Record<string, any> = {};
        Object.keys(schema).forEach(key => {
            values[key] = typeof (state.values[key]) === "string" ? state.values[key]?.trim() : state.values[key];
        });
        return values;
    }

    const isComplete = useMemo(() => {
        let key, isValid = true;
        for (key in schema) {
            const field = schema[key];
            if (!overrides.visibility[key] || !field.isRequired) continue;
            else if ((field.type === "text" || field.type === "phone" || field.type === "password") && (!state.values[key] || (typeof (state.values[key]) === "string" && state.values[key].trim() === ""))) {
                isValid = false;
                break;
            }
            else if (field.type === "checkbox" && (!state.values[key])) {
                isValid = false;
                break;
            }
            else if ((field.type === "select" || field.type === "search") && (!state.dropdowns[key] || !state.dropdowns[key].label)) {
                isValid = false;
                break;
            }
        }
        return isValid;
    }, [schema, state.values, overrides.visibility, state.dropdowns]);

    return {
        values: state.values,
        errors: state.errors,
        dropdowns: state.dropdowns,
        disabled: overrides.disabled,
        visibility: overrides.visibility,
        options: overrides.options,
        isComplete,
        setField,
        setFields,
        setErrors,
        setVisibility,
        setDisabled,
        handleValidation,
        updateDropdown,
        updateDropdowns,
        updateOptions,
        validateRequiredFields,
        getCleanedValues,
        resetForm
    };
};

export default useFormEngine;
