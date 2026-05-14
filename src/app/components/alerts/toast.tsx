import { useEffect, useState } from "react";
import { Text } from "../typography";
import { ToastContentType } from "./alerts";
import { ErrorFilledIcon, InfoFilledIcon, SuccessFilledIcon, WarningFilledIcon } from "./icons";
import { useAlerts } from "./alertsContext";

const IconMap = { "SUCCESS": SuccessFilledIcon, "ERROR": ErrorFilledIcon, "WARNING": WarningFilledIcon, "INFO": InfoFilledIcon };
const BG_MAP = { "SUCCESS": "success", "ERROR": "error", "WARNING": "warning", "INFO": "secondary" };

const Toast = ({ data }: { data: ToastContentType }) => {
    const Icon = IconMap[data.type];
    const { removeToast } = useAlerts();
    const [phase, setPhase] = useState<"enter" | "visible" | "exit">("enter");

    useEffect(() => { window.requestAnimationFrame(() => setPhase("visible")) }, []);

    useEffect(() => {
        const t = setTimeout(() => { setPhase("exit") }, data.duration);
        return () => clearTimeout(t);
    }, [data.duration]);

    useEffect(() => {
        if (phase !== "exit") return;
        const t = setTimeout(() => removeToast(data.id), 500);
        return () => clearTimeout(t);
    }, [phase, removeToast]);

    return (
        <div className={`qb-toast-container position-relative d-flex align-items-stretch p-3 qb-bg-card-grad qb-border-solid-grey qb-br-8 qb-shadow-sm overflow-hidden ${phase === "visible" ? "qb-toast-visible" : phase === "exit" ? "qb-toast-removed" : ""}`} role="status" aria-live="polite">
            <div className={`position-absolute qb-toast-bg qb-bg-${BG_MAP[data.type]}`}></div>
            <div className={`qb-toast-indicator position-absolute qb-bg-${BG_MAP[data.type]}`}></div>
            <div>
                <Icon />
            </div>
            <div className="ps-2 position-relative">
                <Text weight="bold">{data.title}</Text>
                <Text size="paragraph-xs">{data.message}</Text>
            </div>
        </div>
    )
}

const ToastWrapper = ({ data }: { data: ToastContentType[] }) => {

    return (
        <div className="qb-toast-wrapper qb-z-snackbar d-flex flex-column position-fixed gap-2">
            {
                data.map(item => <Toast key={item.id} data={item} />)
            }
        </div>
    )
}

export default ToastWrapper;