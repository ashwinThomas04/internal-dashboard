import { AppleWalletBtn, GoogleWalletBtn } from "../../components/cta";

const LoyaltyCard = ({ url }) => {
  return (
    <div className="w-100 d-flex flex-column">
      <div className="w-100 qb-br-16 overflow-hidden qb-shadow-sm d-flex">
        <img src={url} alt="LOYALTY CARD" className="w-100" />
      </div>
      {/* <div className="w-100 pt-3 d-flex justify-content-center">
        <AppleWalletBtn />
        <GoogleWalletBtn />
      </div> */}
    </div>
  )
}

export default LoyaltyCard;