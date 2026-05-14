import { AlertIconProps } from "./alerts"

export const ErrorIcon = ({ color = "error" }: AlertIconProps) => (
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path className={`qb-stroke-${color}`} d="M8 6.5V9" strokeLinecap="round" strokeLinejoin="round" />
		<path className={`qb-stroke-${color}`} d="M7.13451 2.49904L1.63599 11.9986C1.54801 12.1506 1.50161 12.3231 1.50147 12.4987C1.50132 12.6743 1.54743 12.8469 1.63516 12.999C1.7229 13.1512 1.84915 13.2776 2.00123 13.3654C2.1533 13.4533 2.32584 13.4995 2.50147 13.4995H13.4985C13.6741 13.4995 13.8467 13.4533 13.9987 13.3654C14.1508 13.2776 14.2771 13.1512 14.3648 12.999C14.4525 12.8469 14.4986 12.6743 14.4985 12.4987C14.4984 12.3231 14.452 12.1506 14.364 11.9986L8.86545 2.49904C8.77761 2.34728 8.65141 2.22129 8.4995 2.1337C8.3476 2.04611 8.17533 2 7.99998 2C7.82463 2 7.65237 2.04611 7.50046 2.1337C7.34855 2.22129 7.22235 2.34728 7.13451 2.49904V2.49904Z" strokeLinecap="round" strokeLinejoin="round" />
		<path className={`qb-fill-${color}`} d="M8 11.875C8.34518 11.875 8.625 11.5952 8.625 11.25C8.625 10.9048 8.34518 10.625 8 10.625C7.65482 10.625 7.375 10.9048 7.375 11.25C7.375 11.5952 7.65482 11.875 8 11.875Z" />
	</svg>
)

export const WarningIcon = ({ color = "warning" }: AlertIconProps) => (
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path className={`qb-stroke-${color}`} d="M8 6.5V9" strokeLinecap="round" strokeLinejoin="round" />
		<path className={`qb-stroke-${color}`} d="M7.13451 2.49904L1.63599 11.9986C1.54801 12.1506 1.50161 12.3231 1.50147 12.4987C1.50132 12.6743 1.54743 12.8469 1.63516 12.999C1.7229 13.1512 1.84915 13.2776 2.00123 13.3654C2.1533 13.4533 2.32584 13.4995 2.50147 13.4995H13.4985C13.6741 13.4995 13.8467 13.4533 13.9987 13.3654C14.1508 13.2776 14.2771 13.1512 14.3648 12.999C14.4525 12.8469 14.4986 12.6743 14.4985 12.4987C14.4984 12.3231 14.452 12.1506 14.364 11.9986L8.86545 2.49904C8.77761 2.34728 8.65141 2.22129 8.4995 2.1337C8.3476 2.04611 8.17533 2 7.99998 2C7.82463 2 7.65237 2.04611 7.50046 2.1337C7.34855 2.22129 7.22235 2.34728 7.13451 2.49904V2.49904Z" strokeLinecap="round" strokeLinejoin="round" />
		<path className={`qb-fill-${color}`} d="M8 11.875C8.34518 11.875 8.625 11.5952 8.625 11.25C8.625 10.9048 8.34518 10.625 8 10.625C7.65482 10.625 7.375 10.9048 7.375 11.25C7.375 11.5952 7.65482 11.875 8 11.875Z" />
	</svg>
)

export const InfoIcon = ({ color = "secondary" }: AlertIconProps) => (
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path className={`qb-stroke-${color}`} d="M8.00012 14C11.3138 14 14.0001 11.3137 14.0001 8C14.0001 4.68629 11.3138 2 8.00012 2C4.68641 2 2.00012 4.68629 2.00012 8C2.00012 11.3137 4.68641 14 8.00012 14Z" strokeLinecap="round" strokeLinejoin="round" />
		<path className={`qb-stroke-${color}`} d="M7.5 7.5H8.00006L8 11H8.5" strokeLinecap="round" strokeLinejoin="round" />
		<path className={`qb-fill-${color}`} d="M7.875 5.875C8.22018 5.875 8.5 5.59518 8.5 5.25C8.5 4.90482 8.22018 4.625 7.875 4.625C7.52982 4.625 7.25 4.90482 7.25 5.25C7.25 5.59518 7.52982 5.875 7.875 5.875Z" />
	</svg>
)

export const SuccessIcon = ({ color = "success" }: AlertIconProps) => (
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path className={`qb-stroke-${color}`} d="M10.75 6.5L7.08331 10L5.25 8.25" strokeLinecap="round" strokeLinejoin="round" />
		<path className={`qb-stroke-${color}`} d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
)

export const ErrorFilledIcon = ({ color = "error" }: AlertIconProps) => (
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path className={`qb-fill-${color}`} d="M8.4 17L12 13.4L15.6 17L17 15.6L13.4 12L17 8.4L15.6 7L12 10.6L8.4 7L7 8.4L10.6 12L7 15.6L8.4 17ZM12 22C10.6167 22 9.31667 21.7373 8.1 21.212C6.88333 20.6873 5.825 19.975 4.925 19.075C4.025 18.175 3.31267 17.1167 2.788 15.9C2.26267 14.6833 2 13.3833 2 12C2 10.6167 2.26267 9.31667 2.788 8.1C3.31267 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.31233 8.1 2.787C9.31667 2.26233 10.6167 2 12 2C13.3833 2 14.6833 2.26233 15.9 2.787C17.1167 3.31233 18.175 4.025 19.075 4.925C19.975 5.825 20.6873 6.88333 21.212 8.1C21.7373 9.31667 22 10.6167 22 12C22 13.3833 21.7373 14.6833 21.212 15.9C20.6873 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6873 15.9 21.212C14.6833 21.7373 13.3833 22 12 22Z" />
	</svg>
)

export const WarningFilledIcon = ({ color = "warning" }: AlertIconProps) => (
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path className={`qb-fill-${color}`} d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" />
	</svg>
)

export const InfoFilledIcon = ({ color = "secondary" }: AlertIconProps) => (
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path className={`qb-fill-${color}`} fillRule="evenodd" clipRule="evenodd" d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM11 11V17H13V11H11ZM11 7V9H13V7H11Z" />
	</svg>
)

export const SuccessFilledIcon = ({ color = "success" }: AlertIconProps) => (
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path className={`qb-fill-${color}`} d="M10.6 16.6L17.65 9.55L16.25 8.15L10.6 13.8L7.75 10.95L6.35 12.35L10.6 16.6ZM12 22C10.6167 22 9.31667 21.7373 8.1 21.212C6.88333 20.6873 5.825 19.975 4.925 19.075C4.025 18.175 3.31267 17.1167 2.788 15.9C2.26267 14.6833 2 13.3833 2 12C2 10.6167 2.26267 9.31667 2.788 8.1C3.31267 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.31233 8.1 2.787C9.31667 2.26233 10.6167 2 12 2C13.3833 2 14.6833 2.26233 15.9 2.787C17.1167 3.31233 18.175 4.025 19.075 4.925C19.975 5.825 20.6873 6.88333 21.212 8.1C21.7373 9.31667 22 10.6167 22 12C22 13.3833 21.7373 14.6833 21.212 15.9C20.6873 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6873 15.9 21.212C14.6833 21.7373 13.3833 22 12 22Z" />
	</svg>
)