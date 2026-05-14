import { AppleWalletBtn, GoogleWalletBtn } from "../../components/cta";
import { Modal } from "../../components/modal";
import { Text } from "../../components/typography";
import { useConfig } from "../../context";
import { utils } from "../../utils";
import { MODAL_IDX } from "./"

const SignupSuccessPopup = ({ appleWallet, googleWallet, onClose }) => {
  const platform = utils.getUserPlatform();
  const config = useConfig();

  return (
    <Modal id={MODAL_IDX.signupSuccess} onClose={onClose}>
      <div className="d-flex flex-column align-items-center w-100 py-3">
        <img src={config?.branding?.logo} className="qb-auth-layout-logo" />
        <Text size="title-sm" weight="bold" className="pb-1 pt-3">Welcome Aboard</Text>
        <Text align="center">{config?.ui?.signupSuccessMessage}</Text>
        <div className="d-flex align-items-center justify-content-center pt-4 gap-3">
          {
            platform != "Android" && appleWallet ?
              <AppleWalletBtn url={appleWallet} />
              : platform != "iOS" && googleWallet ?
                <GoogleWalletBtn url={googleWallet} />
                : null
          }
        </div>
      </div>
    </Modal>
  )
}

export default SignupSuccessPopup;