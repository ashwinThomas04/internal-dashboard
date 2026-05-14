import { PaperPropsType } from "./surface";

const Paper = ({ children, className }: PaperPropsType) => {
    return (
        <div className={`qb-surface-paper-wrapper qb-bg-paper-grad p-3 qb-border-solid-grey ${className}`}>
            {children}
        </div>
    )
}

export default Paper;