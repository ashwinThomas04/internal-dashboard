import { useMemo, useState } from "react";
import { Text } from "../../components/typography";
import { TextInput, PasswordInput, PhoneInput, SelectInput, CheckboxInput } from "../../components/input";
import { PrimaryButton, TextLink } from "../../components/cta";
import AuthWrapper from "./index";

import services from "../../service";
import { useApi, useFormEngine } from "../../service/hooks";
import { useCache, useConfig } from "../../context";
import { codec } from "../../utils";
import { useNavigate } from "react-router";
import CONFIG from "../../config";
import { ErrorMessage } from "../../components/alerts";

const defaultSchema = {
  "name": { label: "Name*", id: "name", type: "text", placeholder: "John Doe", error: null, isRequired: true, emptyErrorMessage: services.messageService.getEmptyFieldError("name"), inputWidthSize: "6", validation: services.validationService.isName },
  "email": { label: "Email*", id: "email", type: "text", placeholder: "johndoe@company.com", keyboardType: "email", error: null, isRequired: true, emptyErrorMessage: services.messageService.getEmptyFieldError("email"), inputWidthSize: "6", validation: services.validationService.isEmail },
  "phone": { label: "Phone Number*", id: "phone", type: "phone", placeholder: "9876543210", keyboardType: "tel", error: null, isRequired: true, emptyErrorMessage: services.messageService.getEmptyFieldError("phone"), inputWidthSize: "6", validation: services.validationService.isPhone },
  "dob": { label: "Date of Birth*", id: "dob", type: "text", keyboardType: "date", error: null, isRequired: true, emptyErrorMessage: services.messageService.getEmptyFieldError("date of birth"), inputWidthSize: "6" },
  "gender": { label: "Gender*", id: "gender", type: "select", placeholder: "Select", keyboardType: "text", error: null, isRequired: true, emptyErrorMessage: services.messageService.getEmptyFieldError("gender"), inputWidthSize: "6" },
  "nationality": { label: "Nationality*", id: "nationality", type: "select", placeholder: "Select", isSearchable: true, keyboardType: "text", error: null, isRequired: true, emptyErrorMessage: services.messageService.getEmptyFieldError("Nationality"), inputWidthSize: "6", defaultValue: "AE" },
  "password": { label: "Password*", id: "password", type: "password", placeholder: "********", error: null, isRequired: true, emptyErrorMessage: services.messageService.getEmptyFieldError("password"), inputWidthSize: "12", validation: services.validationService.isPassword },
  "referral": { label: "Referral Code", id: "referral", type: "text", placeholder: "AXLTYD", keyboardType: "text", error: null, isRequired: false, inputWidthSize: "6" },
  "store": { label: "Favourite Home Location*", id: "store", type: "select", placeholder: "Select", isSearchable: true, keyboardType: "text", error: null, isRequired: true, emptyErrorMessage: services.messageService.getEmptyFieldError("Favourite Home Location"), inputWidthSize: "6" },
  "terms": { label: "I agree to receive loyalty rewards, offers and updates via email and text.", id: "terms", type: "checkbox", error: null, isRequired: true, emptyErrorMessage: "Please agree to receive rewards and updates to proceed.", inputWidthSize: "12", defaultValue: true }
}

const LoyaltySignupPage = () => {
  const config = useConfig();
  const formSchema = useMemo(() => config.ui?.signupSchema ?? defaultSchema, [config.ui?.signupSchema]);

  const form = useFormEngine(formSchema, config.ui.dropdownOptions);
  const cache = useCache();
  const navigate = useNavigate();
  const api = useApi();

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
    const url = `${CONFIG.apiBase}/store/${config.mx}/customer/web/sendOtp`;
    const data = JSON.stringify({
      "name": user.name,
      "email": user.email.toLowerCase(),
      "phone_number": `${form.dropdowns?.phone?.value}${user.phone}`,
      "referralCode": user.referral ? user.referral?.toUpperCase() : null,
      "birthday": user.dob ? user.dob : null,
      "gender": form.dropdowns?.gender?.value ? form.dropdowns.gender.value : null,
      "country": form.dropdowns?.nationality?.value ? form.dropdowns.nationality.value : null,
      "password": user.password ? user.password : null,
      "acceptChannelCommunications": user.terms,
      "referrerStoreId": form.dropdowns?.store?.value ? form.dropdowns.store.value : null
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

export default LoyaltySignupPage;
