import { TextProps } from "./typography";
import { I18nContent } from "../i18n";
import { Content, Heading } from "./wrapper";

const wrapper={
    "heading": Heading,
    "content": Content
}

const Text=({children,es,fr,type="content",color="dark",align="inherit",size="paragraph-md",weight="regular",className="",headingType="h3"}:TextProps)=>{
    const TextTag=wrapper[type];
    return(
        <TextTag className={`qb-text-${color} qb-fs-${size} mb-0 text-${align} qb-fw-${weight} ${className}`} headingType={headingType}>
            <I18nContent en={children} es={es} fr={fr}/>
        </TextTag>
    )
}

export { Text };