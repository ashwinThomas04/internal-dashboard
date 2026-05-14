import { useState, useCallback, useMemo } from 'react';
import { CountryOption } from '../../components/input/input';

type FormUi = {
  loader: boolean;
  error: string | null;
  dropdowns: Record<string, Record<string, string> | null>;
  options: Record<string, CountryOption[]>;
  updateDropdown: (id: string, value: Record<string, string>) => void;
  updateOptions: (id: string, options: CountryOption[]) => void;
  updateLoader: (loader: boolean) => void;
  updateError: (error: string | null) => void;
};

const useFormUi = (selectOptions: Record<string, CountryOption[]>, initialValues: Record<string, Record<string, string> | null>): FormUi => {
  const getInitialValues = useMemo(() => {
    const dropdowns: Record<string, Record<string, string> | null> = {};
    const options: Record<string, CountryOption[]> = {};
    Object.keys(selectOptions).forEach(key => {
      options[key] = [...selectOptions[key]];
      dropdowns[key] = { ...initialValues[key] };
    });
    return { dropdowns, options };
  }, [selectOptions]);

  const [ui, setUi] = useState({
    dropdowns: getInitialValues.dropdowns,
    options: getInitialValues.options
  });
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateDropdown = useCallback((id: string, value: Record<string, string>) => {
    setUi((prev) => {
      return {
        ...prev,
        dropdowns: {
          ...prev.dropdowns,
          [id]: value
        }
      }
    })
  }, []);

  const updateOptions = useCallback((id: string, options: CountryOption[]) => {
    setUi((prev) => {
      return {
        ...prev,
        options: {
          ...prev.options,
          [id]: options
        }
      }
    })
  }, []);

  return {
    loader,
    error,
    dropdowns: ui.dropdowns,
    options: ui.options,
    updateDropdown,
    updateOptions,
    updateLoader: setLoader,
    updateError: setError
  }
}

export default useFormUi;