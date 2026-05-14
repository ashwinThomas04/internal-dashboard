import { useMemo, useState } from "react";
import { Text } from "../../components/typography";
import { TextInput, PasswordInput, PhoneInput, SelectInput, CheckboxInput } from "../../components/input";
import { PrimaryButton, TextLink } from "../../components/cta";
import AuthWrapper from "./index";

import services from "../../service";
import { useApi, useFormEngine } from "../../service/hooks";
import { useAuth, useCache, useConfig } from "../../context";
import { codec } from "../../utils";
import { useNavigate } from "react-router";
import CONFIG from "../../config";
import { ErrorMessage } from "../../components/alerts";

const defaultSchema = {
  "firstName": { label: "First Name*", id: "firstName", type: "text", placeholder: "John", error: null, isRequired: true, emptyErrorMessage: services.messageService.getEmptyFieldError("first name"), inputWidthSize: "6", validation: services.validationService.isName },
  "lastName": { label: "Last Name*", id: "lastName", type: "text", placeholder: "Doe", error: null, isRequired: true, emptyErrorMessage: services.messageService.getEmptyFieldError("last name"), inputWidthSize: "6", validation: services.validationService.isName },
  "phone": { label: "Phone Number*", id: "phone", type: "phone", placeholder: "9876543210", keyboardType: "tel", error: null, isRequired: true, emptyErrorMessage: services.messageService.getEmptyFieldError("phone"), inputWidthSize: "12", validation: services.validationService.isPhone, defaultValue: { "label": "Mexico", "value": "52", "code": "+52", "alpha2": "MX" } },
  "email": { label: "Email*", id: "email", type: "text", placeholder: "johndoe@company.com", keyboardType: "email", error: null, isRequired: true, emptyErrorMessage: services.messageService.getEmptyFieldError("email"), inputWidthSize: "6", validation: services.validationService.isEmail },
  "dob": { label: "Date of Birth*", id: "dob", type: "text", keyboardType: "date", error: null, isRequired: true, emptyErrorMessage: services.messageService.getEmptyFieldError("date of birth"), inputWidthSize: "6" }
}

const SubscriptionSignupPage = () => {
  const config = useConfig();
  const formSchema = useMemo(() => config.ui?.signupSchema ?? defaultSchema, [config.ui?.signupSchema]);

  const form = useFormEngine(formSchema, config.ui.dropdownOptions);
  const cache = useCache();
  const navigate = useNavigate();
  const api = useApi();
  const auth = useAuth();

  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (val, id) => {
    form.setField(id, val);
  }

  const handleSelect = (val, id) => {
    form.updateDropdown(id, val);
  }

  const handleSelectChange = (val, id) => {
    if (formSchema[id].isSearchable && id === "nationality") {
      form.updateDropdown(id, null);
      const filteredOptions = config.ui.dropdownOptions.nationality.filter((option) => option.search.includes(val.toLowerCase()));
      form.updateOptions({ [id]: filteredOptions });
    }
    else if (formSchema[id].isSearchable && id === "store") {
      form.updateDropdown(id, null);
      const filteredOptions = config.ui.dropdownOptions.store.filter((option) => option.search.includes(val.toLowerCase()));
      form.updateOptions({ [id]: filteredOptions });
    }
  }

  const handleSignup = async (user) => {
    const url = `${CONFIG.apiBase}/cec-dashboard/create-customer`;
    const data = JSON.stringify({
      "firstname": user.firstName,
      "lastname": user.lastName,
      "email": user.email.toLowerCase(),
      "phone": `${form.dropdowns?.phone?.value}${user.phone}`,
      "dateOfBirth": user.dob ? user.dob : null,
      "merchantId": auth.store.chainId,
      "storeId": auth.store.storeId,
      "isLoyaltyConsentGiven": true,
      "mobileOtpVerificationRequired": true,
      "emailOtpVerificationRequired": false,
      "countryCode": form.dropdowns?.phone?.alpha2
    });
    return await api.post(url, data);
  }

  const onSubmit = async (e) => {
    e?.preventDefault();
    const isValid = form.handleValidation();
    if (isValid) {
      setLoader(true);
      setError(null);
      const v = form.getCleanedValues();
      const res = await handleSignup(v);
      if (res?.ok) {
        setLoader(false);
        const r = codec.chrono12().toLowerCase();
        cache.setItem(r, { v, d: form.dropdowns, type: "signup" });
        navigate(`/auth/otp?ref=${r}`, { state: { flow: "signup", type: "phone" } });
      }
      else {
        setLoader(false);
        setError(res?.message);
      }
    }
  }

  const onFormSubmit = e => e?.preventDefault();

  return (
    <AuthWrapper size={6} title="Signup">
      <form className="container-fluid px-0" onSubmit={onFormSubmit}>
        <div className="row gy-3">
          <div className="col-12">
            <Text headingType="h1" size="title-md" weight="bold" type="heading">Create Account</Text>
            <Text className="pb-2">Join to access your account and benefits</Text>
          </div>
          {
            Object.keys(formSchema).map((id) => {
              if (!form.visibility[id]) return null;
              return (
                <div className={`col-12 col-lg-${formSchema[id].inputWidthSize}`} key={`signup-form-input-${id}`}>
                  {
                    formSchema[id].type === "password" ?
                      <PasswordInput
                        id={id}
                        value={form.values[id]}
                        disabled={form.disabled[id]}
                        error={form.errors[id]}
                        placeholder={formSchema[id].placeholder}
                        label={formSchema[id].label}
                        required={formSchema[id].isRequired}
                        info="Use at least one uppercase, one lowercase, one number, and one special character."
                        onChange={handleInputChange}
                      />
                      : formSchema[id].type === "phone" ?
                        <PhoneInput
                          id={id}
                          value={form.values[id]}
                          disabled={form.disabled[id]}
                          error={form.errors[id]}
                          placeholder={formSchema[id].placeholder}
                          label={formSchema[id].label}
                          countryOptions={form.options[id]}
                          selectedCountry={form.dropdowns[id]}
                          required={formSchema[id].isRequired}
                          onCountrySelect={handleSelect}
                          onChange={handleInputChange}
                        />
                        : formSchema[id].type === "select" ?
                          <SelectInput
                            id={id}
                            selected={form.dropdowns[id]}
                            disabled={form.disabled[id]}
                            error={form.errors[id]}
                            placeholder={formSchema[id].placeholder}
                            type={formSchema[id].keyboardType}
                            label={formSchema[id].label}
                            options={form.options[id]}
                            isInputAllowed={formSchema[id].isSearchable}
                            isSearchable={formSchema[id].isSearchable}
                            required={formSchema[id].isRequired}
                            onSelect={handleSelect}
                            onChange={handleSelectChange}
                          />
                          : formSchema[id].type === "checkbox" ?
                            <CheckboxInput
                              id={id}
                              checked={form.values[id]}
                              error={form.errors[id]}
                              label={formSchema[id].label}
                              required={formSchema[id].isRequired}
                              onChange={handleInputChange}
                            />
                            :
                            <TextInput
                              id={id}
                              value={form.values[id]}
                              disabled={form.disabled[id]}
                              error={form.errors[id]}
                              placeholder={formSchema[id].placeholder}
                              type={formSchema[id].keyboardType}
                              label={formSchema[id].label}
                              required={formSchema[id].isRequired}
                              onChange={handleInputChange}
                            />
                  }
                </div>
              )
            })
          }
          {
            error ?
              <div className="col-12">
                <ErrorMessage className="pt-2">{error}</ErrorMessage>
              </div>
              :
              null
          }
          <div className="col-12">
            <div className="w-100 d-flex flex-column align-items-stretch gap-3 pt-3">
              <PrimaryButton type={form.isComplete ? "submit" : "button"} className="qb-btn-fill" isActive={form.isComplete} onDisabledClick={form.validateRequiredFields} onClick={onSubmit} isLoading={loader}>Sign up</PrimaryButton>
            </div>
          </div>
          <div className="col-12">
            <div className="w-100 d-flex justify-content-center pb-3 pt-4">
              <Text color="muted" size="paragraph-xs" weight="regular">Already have an account? <TextLink as="router" size="xs" to="/auth/login">Login</TextLink></Text>
            </div>
          </div>
        </div>
      </form>
    </AuthWrapper>
  )
}

export default SubscriptionSignupPage;
