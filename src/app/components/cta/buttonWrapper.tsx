import { ButtonWrapperProps } from "./cta";

const ButtonWrapper=({children, className, ...rest}:ButtonWrapperProps)=>{
    return <button className={`qb-btn position-relative ${className}`} {...rest}>{children}</button>
}
export default ButtonWrapper;