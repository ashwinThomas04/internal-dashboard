import { ReactNode } from "react";

const PhoneMockup=({children,header}:{children:ReactNode,header:ReactNode})=>{

    return(
        <div className="qb-phone-mockup-wrapper">
            <div className="qb-phone-mockup-container position-relative">
                <div className="qb-phone-mockup-outer-skin position-absolute w-100 h-100 p-3 qb-br-32 qb-bg-muted d-flex align-items-stretch">
                    <div className="d-flex flex-column flex-fill pb-3 qb-br-24 qb-bg-white overflow-hidden qb-phone-mockup-content-overflow-wrap">
                        {header}
                        <div className="qb-phone-mockup-content-wrap">
                            {children}
                        </div>
                    </div>
                </div>
                <div className="qb-phone-mockup-notch position-absolute qb-bg-muted"></div>
                <div className="qb-phone-mockup-volume position-absolute d-flex align-items-center flex-column">
                    <div className="qb-phone-mockup-volume-btn qb-bg-muted"></div>
                    <div className="qb-phone-mockup-volume-btn qb-bg-muted"></div>
                </div>
                <div className="qb-phone-mockup-lock qb-bg-muted position-absolute"></div>
                <div className="qb-phone-mockup-mute qb-bg-muted position-absolute"></div>
            </div>
        </div>
    )
}

export default PhoneMockup;