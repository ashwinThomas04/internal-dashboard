import { Modal } from "../../components/modal";
import { MODAL_IDX } from "./"

const LoaderPopup = () => {

  return (
    <Modal id={MODAL_IDX.loader}>
      <div className="d-flex flex-column align-items-stretch w-100 py-6">
        <div className="w-100 py-6 d-flex align-items-center justify-content-center">
          <div className="qb-page-loader"></div>
        </div>
      </div>
    </Modal>
  )
}

export default LoaderPopup;