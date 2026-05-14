import { useEffect, useState } from "react";
import { GhostButton, PrimaryButton } from "../../components/cta";
import { PhoneInput, SelectInput, TextInput } from "../../components/input";
import { Modal } from "../../components/modal";
import { Text } from "../../components/typography";
import { useConfig } from "../../context";
import services from "../../service";
import { useApi, useFormEngine } from "../../service/hooks";
import { MODAL_IDX } from "./"
import { ErrorMessage } from "../../components/alerts";
import CONFIG from "../../config";

const formSchema = {
  "name": { label: "Name*", id: "name", type: "text", placeholder: "John Doe", error: null, isRequired: true, emptyErrorMessage: services.messageService.getEmptyFieldError("name"), inputWidthSize: "12", validation: services.validationService.isName },
  "phone": { label: "Phone Number*", id: "phone", type: "phone", placeholder: "9876543210", keyboardType: "tel", error: null, isRequired: true, emptyErrorMessage: services.messageService.getEmptyFieldError("phone"), inputWidthSize: "12", validation: services.validationService.isPhone },
  "email": { label: "Email*", id: "email", type: "text", placeholder: "johndoe@company.com", keyboardType: "email", error: null, isRequired: true, emptyErrorMessage: services.messageService.getEmptyFieldError("email"), inputWidthSize: "12", validation: services.validationService.isEmail },
  "dob": { label: "Date of Birth*", id: "dob", type: "text", keyboardType: "date", error: null, isRequired: true, emptyErrorMessage: services.messageService.getEmptyFieldError("date of birth"), inputWidthSize: "12" },
}

const UpdateProfilePopup = ({ user, onClose, onSuccess, token }) => {
  const config = useConfig();
  const form = useFormEngine(formSchema, config.ui.dropdownOptions);
  const api = useApi();

  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(null);

  const resetForm = () => {
    if (user) {
      const { code, number } = config.getPhoneAndCode(user.phoneNo, user.countryCode);
      form.updateDropdown("phone", form.options.phone.find((opt) => opt.value === code));
      form.setFields({
        name: user.name,
        email: user.emailId,
        phone: number,
        dob: user.birthday
      });
      form.setDisabled({
        "phone": true,
        "email": true
      });
    }
  }

  const handleInputChange = (val, id) => {
    form.setField(id, val);
  }

  const handleSelect = (val, id) => {
    form.updateDropdown(id, val);
  }

  const handleClose = () => {
    resetForm();
    setError(null);
    onClose();
  }

  const handleUpdate = async (u) => {
    const { number } = config.getPhoneAndCode(user.phoneNo, user.countryCode);
    const url = `${CONFIG.apiBase}/consumer/editProfile`;
    const data = JSON.stringify({
      "name": u.name,
      "email": user.emailId,
      "phone_number": number,
      "birthday": u.dob ? u.dob : null,
    });
    return await api.post(url, data, token);
  }

  const onSubmit = async () => {
    const isValid = form.handleValidation();
    if (isValid) {
      setLoader(true);
      setError(null);
      const v = form.getCleanedValues();
      const res = await handleUpdate(v);
      if (res?.ok) {
        setLoader(false);
        onSuccess();
      }
      else {
        setLoader(false);
        setError(res?.message);
      }
    }
  }

  useEffect(() => {
    resetForm();
  }, [user]);

  return (
    <Modal id={MODAL_IDX.updateProfile} width={8} onClose={handleClose}>
      <div className="container-fluid px-0">
        <div className="row gy-3 gx-3">
          <div className="col-12">
            <Text size="title-sm" weight="bold" className="pb-1">Update Profile</Text>
          </div>
          {
            Object.keys(formSchema).map((id) => {
              if (!form.visibility[id]) return null;
              return (
                <div className={`col-12 col-lg-${formSchema[id].inputWidthSize}`} key={`signup-form-input-${id}`}>
                  {
                    formSchema[id].type === "phone" ?
                      <PhoneInput
                        id={id}
                        value={form.values[id]}
                        disabled={form.disabled[id]}
                        error={form.errors[id]}
                        placeholder={formSchema[id].placeholder}
                        label={formSchema[id].label}
                        countryOptions={form.options[id]}
                        selectedCountry={form.dropdowns[id]}
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
                          onSelect={handleSelect}
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
            <div className="d-flex gap-3 pt-3 justify-content-end w-100">
              <GhostButton size="sm" onClick={handleClose}>Cancel</GhostButton>
              <PrimaryButton size="sm" isActive={form.isComplete} onDisabledClick={form.validateRequiredFields} onClick={onSubmit} isLoading={loader}>Update</PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default UpdateProfilePopup