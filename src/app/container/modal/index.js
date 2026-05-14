const MODAL_IDX = {
  logout: "qb-logout-confirmation-popup",
  updateProfile: "qb-update-profile-popup",
  serviceUnavailable: "qb-service-unavailable-popup",
  changePassword: "qb-change-password-popup",
  signupSuccess: "qb-signup-success-popup",
  loader: "qb-loader-popup"
}

import LogoutConfirmationPopup from "./logoutConfirmation";
import UpdateProfilePopup from "./updateProfie";
import ServiceUnavailablePopup from "./serviceUnavailable";
import ChangePasswordPopup from "./changePassword";
import SignupSuccessPopup from "./signupSuccess";
import LoaderPopup from "./loaderModal";

export { LogoutConfirmationPopup, UpdateProfilePopup, ServiceUnavailablePopup, ChangePasswordPopup, SignupSuccessPopup, LoaderPopup, MODAL_IDX }