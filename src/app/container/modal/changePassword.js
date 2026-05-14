import { useEffect, useState } from "react";
import { GhostButton, PrimaryButton, TextLink } from "../../components/cta";
import { PasswordInput, SelectInput } from "../../components/input";
import { Modal } from "../../components/modal";
import { Text } from "../../components/typography";
import { useConfig } from "../../context";
import services from "../../service";
import { useApi, useFormEngine } from "../../service/hooks";
import { MODAL_IDX } from "./"
import { ErrorMessage } from "../../components/alerts";
import CONFIG from "../../config";

const OTP_OPTIONS = [{ label: "Phone", value: "phone" }, { label: "Email", value: "email" }];
const formSchema = {
  "recieveOtp": { label: "Verify using", id: "recieveOtp", type: "select", placeholder: "Select", error: null, isRequired: true, inputWidthSize: "12", defaultValue: OTP_OPTIONS[0] },
  "currentPassword": { label: "Current Password", id: "currentPassword", type: "password", placeholder: "********", error: null, isRequired: true, emptyErrorMessage: services.messageService.getEmptyFieldError("password"), inputWidthSize: "12", validation: services.validationService.isPassword },
  "newPassword": { label: "New Password", id: "newPassword", type: "password", placeholder: "********", error: null, isRequired: true, emptyErrorMessage: services.messageService.getEmptyFieldError("password"), inputWidthSize: "12", validation: services.validationService.isPassword },
  "otp": { label: "OTP", id: "otp", type: "password", placeholder: "****", keyboardType: "numeric", error: null, isRequired: true, emptyErrorMessage: services.messageService.getEmptyFieldError("otp"), inputWidthSize: "12", validation: services.validationService.isOtp }

}

const ChangePasswordPopup = ({ user, onClose, onSuccess, token }) => {
  const config = useConfig();
  const form = useFormEngine(formSchema, { "recieveOtp": OTP_OPTIONS });
  const api = useApi();

  const [screen, setScreen] = useState("password");
  const [useOtp, setUseOtp] = useState(false);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(null);

  const resetForm = () => {
    if (user) {
      setScreen("password");
      setUseOtp(false);
      form.setFields({
        "currentPassword": "",
        "newPassword": "",
        "otp": ""
      });
      if (user.isPasswordSet) {
        form.setVisibility({ "currentPassword": true, "otp": false, "recieveOtp": false, "newPassword": true });
      }
      else form.setVisibility({ "currentPassword": false, "otp": false, "recieveOtp": true, "newPassword": true });
    }
  }

  const toggleScreen = () => {
    if (screen === "password") {
      form.setVisibility({ "otp": true, "recieveOtp": false, "newPassword": false });
      setScreen("otp");
    }
    else {
      form.setVisibility({ "otp": false, "recieveOtp": true, "newPassword": true });
      setScreen("password");
    }
  }


  const toggleUseOtp = () => {
    if (useOtp) {
      form.setVisibility({ "currentPassword": true, "otp": false, "recieveOtp": false, "newPassword": true });
      setUseOtp(false);
    }
    else {
      form.setVisibility({ "currentPassword": false, "otp": false, "recieveOtp": true, "newPassword": true });
      setUseOtp(true);
    }
  }

  const handleSelect = (val, id) => {
    form.updateDropdown(id, val);
  }

  const handleInputChange = (val, id) => {
    form.setField(id, val);
  }

  const handleClose = () => {
    resetForm();
    onClose();
  }

  const handleVerifyOtp = async (u) => {
    const { number } = config.getPhoneAndCode(user.phoneNo, user.countryCode);
    const url = `${CONFIG.apiBase}/consumer/verifyAndSavePassword`;
    const data = JSON.stringify({
      "newPassword": u.newPassword,
      "email": form.dropdowns.recieveOtp.value === "email" ? user.emailId : null,
      "phone": form.dropdowns.recieveOtp.value === "phone" ? number : null,
      "storeId": config.mx,
      "isPasswordSet": user.isPasswordSet ? true : false,
      "oldPassword": useOtp || !user.isPasswordSet ? null : u.currentPassword,
      "doNotRememberPassword": useOtp,
      "otp": u.otp
    });
    return await api.post(url, data, token);
  }

  const handleUpdate = async (u) => {
    const { number } = config.getPhoneAndCode(user.phoneNo, user.countryCode);
    const url = `${CONFIG.apiBase}/consumer/handlePasswordUpdate`;
    const data = JSON.stringify({
      "newPassword": u.newPassword,
      "email": form.dropdowns.recieveOtp.value === "email" ? user.emailId : null,
      "phone": form.dropdowns.recieveOtp.value === "phone" ? number : null,
      "storeId": config.mx,
      "isPasswordSet": user.isPasswordSet ? true : false,
      "oldPassword": useOtp || !user.isPasswordSet ? null : u.currentPassword,
      "doNotRememberPassword": useOtp
    });
    return await api.post(url, data, token);
  }

  const onSubmit = async () => {
    const isValid = form.handleValidation();
    if (isValid) {
      setLoader(true);
      setError(null);
      const v = form.getCleanedValues();
      if (screen === "password") {
        const res = await handleUpdate(v);
        if (res?.ok) {
          setLoader(false);
          if (!user.isPasswordSet || useOtp) toggleScreen();
          else onSuccess();
        }
        else {
          setLoader(false);
          setError(res?.message);
        }
      }
      else {
        const res = await handleVerifyOtp(v);
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
  }

  useEffect(() => {
    resetForm();
  }, [user]);

  return (
    <Modal id={MODAL_IDX.changePassword} width={5} onClose={handleClose}>
      <div className="container-fluid px-0">
        <div className="row gy-3 gx-3">
          <div className="col-12">
            <Text size="title-sm" weight="bold" className="pb-1">
              {
                user?.isPasswordSet ?
                  "Update Password"
                  : "Set New Password"
              }
            </Text>
            {
              screen === "otp" ?
                <Text size="paragraph-sm" className="pb-3">
                  Please use the 4 digit OTP send{form.dropdowns.recieveOtp.value === "email" ? ` to ${user.emailId}` : ` to ${config.formatPhone(user.phoneNo, user.countryCode)}`} to {user.isPasswordSet ? " update your" : " set new"} password.
                </Text>
                : useOtp ?
                  <Text size="paragraph-sm" className="pb-3">
                    Please use your registered phone number or email address to receive an OTP and verify your identity.
                  </Text>
                  : <Text size="paragraph-sm" className="pb-3">
                    Please enter your current password followed by the new password.
                  </Text>
            }
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
                        onChange={handleInputChange} />
                      :

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
            <div className="w-100 d-flex justify-content-end pt-3 pb-2">
              <Text color="muted" size="paragraph-xs" weight="regular">{useOtp ? "Remember current password? " : "Don't remember your password? "}<TextLink size="xs" to="/auth/forgot-password" onClick={toggleUseOtp}>{useOtp ? "Use Password" : "Use OTP"}</TextLink></Text>
            </div>
          </div>
          <div className="col-12">
            <div className="d-flex gap-3 pt-3 justify-content-end w-100">
              <GhostButton size="sm" onClick={handleClose}>Cancel</GhostButton>
              <PrimaryButton size="sm" isActive={form.isComplete} onDisabledClick={form.validateRequiredFields} onClick={onSubmit} isLoading={loader}>
                {screen === "password" ? "Update" : "Verify & Update"}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ChangePasswordPopup