import { CardPropsType } from "./surface";

const Card = ({ children, className, onClick }: CardPropsType) => {
    return (
        <div className={`qb-surface-card-wrapper qb-bg-card-grad qb-border-solid-grey qb-shadow-md qb-br-16 ${className}`} onClick={onClick}>
            {children}
        </div>
    )
}

export default Card;