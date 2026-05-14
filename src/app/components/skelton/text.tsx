import { useId, useMemo } from "react";
import { SkeltonTextProps } from "./skelton";

const SkeltonText=({size="paragraph-md",rows=1,className, style, animate=true}:SkeltonTextProps)=>{
    const idx=useId();

    const r=useMemo(()=>Array.from({length:rows}),[rows]);

    return(
        <div className={`qb-skelton-wrapper d-flex flex-column gap-2 ${className}`} style={style}>
           {r.map((_,i)=><div key={`skelton-${idx}-${i}`} className={`position-relative overflow-hidden qb-br-64 qb-bg-grey qb-skelton-size-${size} ${rows===1?"w-100":i===rows-1?"w-60":"w-100"} ${animate?"qb-skelton-anime":""}`}></div>)}
        </div>
    )
}

export default SkeltonText;