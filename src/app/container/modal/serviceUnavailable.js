import { Modal } from "../../components/modal";
import { Text } from "../../components/typography";
import { MODAL_IDX } from "./"

const ServiceUnavailablePopup = () => {

  return (
    <Modal id={MODAL_IDX.serviceUnavailable}>
      <div className="d-flex flex-column align-items-center w-100 py-3">
        <img src="/assets/empty-illustrations/cloud.webp" alt="Service Unavailable" className="qb-empty-illustration" />
        <Text size="title-sm" weight="bold" className="pb-1 pt-4">Customization coming soon</Text>
        <Text align="center">Communication preferences aren't configurable yet. We're working on giving you more control.</Text>
      </div>
    </Modal>
  )
}

export default ServiceUnavailablePopup;