import { SkeltonBase } from "./skelton"

const SkeltonBox=({animate=true,style,className}:SkeltonBase)=>{
    return(
        <div className={`position-relative overflow-hidden qb-bg-grey ${animate?"qb-skelton-anime":""} ${className}`} style={style}></div>
    )
}

export default SkeltonBox;