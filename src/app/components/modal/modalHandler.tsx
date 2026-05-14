import { useEffect, useRef } from "react"
import { ModalContainerProps, ModalHandlerProps } from "./modal"
import CONFIG from "../../config";
import { useModal } from "./modalContext";
import { createPortal } from "react-dom";

const ModalContainer = ({ id, children, width = 4, activeModalId, onClose }: ModalContainerProps) => {
    return (
        <div className="qb-modal-container position-fixed qb-z-popup container-fluid" data-id={id}>
            <div className="row justify-content-center h-100">
                <div className={`col-md-${width}`}>
                    <div className="w-100 h-100 position-relative">
                        <div className={`qb-modal-dialog-wrapper d-flex align-items-center position-absolute ${activeModalId && activeModalId === id ? "qb-modal-dialog-open" : ""}`}>
                            <div className="qb-modal-dialog w-100 qb-bg-card-grad qb-border-solid-grey qb-br-16 qb-shadow-sm py-4 position-relative d-flex overflow-hidden" role={activeModalId && activeModalId === id ? "dialog" : "none"} id={`dialog-box-${id}`}>
                                <div className="qb-modal-dialog-scroll-wrapper px-4 w-100">
                                    {children}
                                </div>
                                <div className="qb-modal-close-button position-absolute d-flex align-items-center justify-content-center qb-cursor-pointer" onClick={onClose}>
                                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.5 19.5L19.5 12.5M12.5 12.5L19.5 19.5" stroke="#0A0A0A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const ModalHandler = ({ entry }: ModalHandlerProps) => {
    const modal = useModal();

    const onClose = () => modal.closeClicked();

    return (
        <>{createPortal(<ModalContainer key={`modal-id-${entry.id}`} id={entry.id} width={entry.width} activeModalId={modal.activeModalId} onClose={onClose}>{entry.children}</ModalContainer>, document.body)}</>
    )
}

export const ModalBackdrop = ({ activeModalId }: { activeModalId: string | null }) => {
    const docBody = useRef<HTMLElement>(document.body);
    const domBase = useRef<HTMLElement>(document.getElementById(CONFIG.domBaseID));
    const modal = useModal();

    const handleModalOpened = () => {
        if (!domBase?.current) return;
        docBody.current.style.overflow = "hidden";
        domBase.current.setAttribute("aria-hidden", "true");
        domBase.current.classList.add("qb-modal-open");
    }

    const handleModalDismissed = () => {
        if (!domBase?.current) return;
        docBody.current.style.overflow = "visible";
        domBase.current.removeAttribute("aria-hidden");
        domBase.current.classList.remove("qb-modal-open");
    }

    const handleModalClose = () => modal.closeClicked();

    useEffect(() => {
        if (activeModalId) handleModalOpened();
        else handleModalDismissed();
        return () => handleModalDismissed();
    }, [activeModalId]);

    return (
        <div className={`qb-modal-backdrop position-fixed qb-z-backdrop ${activeModalId ? "qb-modal-active" : ""}`} onClick={handleModalClose}></div>
    )
}