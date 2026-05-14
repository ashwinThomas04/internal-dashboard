import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { AlertsContextType, ToastContentType, ToastType } from "./alerts";
import { codec, dateTime } from "../../utils";
import { createPortal } from "react-dom";
import ToastWrapper from "./toast";

const AlertsContext = createContext<AlertsContextType | null>(null);

export const useAlerts = () => {
	const ctx = useContext(AlertsContext);
	if (!ctx) throw new Error("Alerts Context Missing");
	return ctx;
}

export const AlertsProvider = ({ children }: { children: ReactNode }) => {
	const [toast, setToast] = useState<ToastContentType[]>([]);

	const triggerToast = (title: string, message: string, type: ToastType = "SUCCESS", duration: number = 4) => {
		const id = `alert_toast_${codec.chrono12()}`;
		setToast(t => [...t, { id, title, message, type, duration: dateTime.convertToSeconds(duration) }]);
	}

	const removeToast = async (id: string) => {
		setToast(t => t.filter(e => e.id !== id));
	}

	const alerts = useMemo(() => ({ triggerToast, removeToast }), [triggerToast, removeToast]);

	return (
		<AlertsContext.Provider value={alerts}>
			{children}
			{toast?.length ? createPortal(<ToastWrapper data={toast} />, document.body) : null}
		</AlertsContext.Provider>
	)
}