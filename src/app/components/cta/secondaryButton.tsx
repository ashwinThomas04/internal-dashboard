import { I18nContent } from "../i18n";
import ButtonWrapper from "./buttonWrapper";
import { ButtonProps } from "./cta";

const SecondaryButton=({children,id,size="md",isActive=true,isLoading,es,fr,className="",onClick,onDisabledClick,...rest}: ButtonProps) => {

    const handleButtonClick=(e:React.MouseEvent<HTMLButtonElement>)=>{
        if(isActive&&!isLoading&&onClick)onClick(id,e);
        else if(!isActive&&!isLoading&&onDisabledClick)onDisabledClick(id,e);
    }


    return (
        <ButtonWrapper onClick={handleButtonClick} className={`qb-btn-${size} qb-fw-semi-bold qb-secondary-btn qb-fs-paragraph-${size}  ${isActive?"":"qb-btn-disabled"} ${isLoading?"qb-btn-loading":""} ${className}`} {...rest} disabled={!isActive||isLoading}>
            <I18nContent en={children} es={es} fr={fr} />
        </ButtonWrapper>
    )
}

export default SecondaryButton;