import { AlertMessageProps } from "./alerts";
import { ErrorIcon, InfoIcon, WarningIcon } from "./icons";

export const ErrorMessage = ({ children, className = "" }: AlertMessageProps) => {
	return (
		<div role="alert" className={`d-flex align-items-center qb-alert-error-message-wrap ${className}`}>
			<div className="pt-1">
				<ErrorIcon />
			</div>
			<p className="qb-text-error ps-1 qb-fs-paragraph-xs qb-fw-semi-bold mb-0">{children}</p>
		</div>
	)
}

export const WarningMessage = ({ children, className = "" }: AlertMessageProps) => {
	return (
		<div role="alert" className={`d-flex align-items-center qb-alert-error-message-wrap ${className}`}>
			<div className="pt-1">
				<WarningIcon />
			</div>
			<p className="qb-text-warning ps-1 qb-fs-paragraph-xs qb-fw-semi-bold mb-0">{children}</p>
		</div>
	)
}

export const InfoMessage = ({ children, className = "" }: AlertMessageProps) => {
	return (
		<div role="alert" className={`d-flex align-items-center qb-alert-error-message-wrap ${className}`}>
			<div className="pt-1">
				<InfoIcon color="muted" />
			</div>
			<p className="qb-text-muted ps-1 qb-fs-paragraph-xs qb-fw-semi-bold mb-0">{children}</p>
		</div>
	)
}