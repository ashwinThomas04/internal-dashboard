import { useEffect, useRef } from "react";
import { ModalPropsType } from "./modal";
import { useModal } from "./modalContext";
import { ModalHandler } from "./modalHandler";

const Modal = ({ id, width, children, onClose }: ModalPropsType) => {
    const modal = useModal();

    useEffect(() => {
        modal.append({ id, width, onClose });
        return () => modal.remove(id);
    }, [id]);

    return <ModalHandler entry={{ id, width, children }} />
}

export default Modal;