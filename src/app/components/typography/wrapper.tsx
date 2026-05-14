import { ContentWrapperProps, HeadingWrapperProps } from "./typography";

const H1=({children, className}:ContentWrapperProps)=>{ return <h1 className={className}>{children}</h1> }
const H2=({children, className}:ContentWrapperProps)=>{ return <h2 className={className}>{children}</h2> }
const H3=({children, className}:ContentWrapperProps)=>{ return <h3 className={className}>{children}</h3> }
const H4=({children, className}:ContentWrapperProps)=>{ return <h4 className={className}>{children}</h4> }
const H5=({children, className}:ContentWrapperProps)=>{ return <h5 className={className}>{children}</h5> }
const H6=({children, className}:ContentWrapperProps)=>{ return <h6 className={className}>{children}</h6> }

const headingWrapper={"h1":H1,"h2":H2,"h3":H3,"h4":H4,"h5":H5,"h6":H6}

const Heading=({headingType="h3",children,className}:HeadingWrapperProps)=>{
    const Wrapper=headingWrapper[headingType];
    return <Wrapper className={className}>{children}</Wrapper>
}

const Content=({children, className}:ContentWrapperProps)=>{
    return <p className={className}>{children}</p>
}

export { Content, Heading }