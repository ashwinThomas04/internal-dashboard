import { GhostButton, PrimaryButton } from "../../components/cta";
import { Modal } from "../../components/modal";
import { Text } from "../../components/typography";
import { MODAL_IDX } from "./"

const LogoutConfirmationPopup = ({ onConfirm, onCancel }) => {

  return (
    <Modal id={MODAL_IDX.logout}>
      <Text size="title-sm" weight="bold" className="pb-1">Confirm Logout</Text>
      <Text>You are about to end your session on this device. Are you sure you want to logout?</Text>
      <div className="d-flex gap-3 pt-3 justify-content-end w-100">
        <GhostButton size="sm" onClick={onCancel}>Cancel</GhostButton>
        <PrimaryButton size="sm" onClick={onConfirm}>Logout</PrimaryButton>
      </div>
    </Modal>
  )
}

export default LogoutConfirmationPopup