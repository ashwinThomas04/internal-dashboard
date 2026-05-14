import { AvatarPropsType } from "./avatar";

const Avatar=({initials,size="md"}:AvatarPropsType)=>{

    return(
        <div className={`qb-avatar-wrapper qb-avatar-${size} d-flex align-items-center justify-content-center`}>
            <p className="qb-avatar-text qb-fw-black">{initials}</p>
        </div>
    )
}

export default Avatar;