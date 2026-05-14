const AppleWalletBtn = ({ url }: { url: string }) => {
  return (
    <a href={url} className="d-flex" rel="noopener noreferrer" target='_blank'>
      <img src="/assets/images/appleWallet.png" style={{ width: "auto", height: "48px" }} />
    </a>
  )
}

const GoogleWalletBtn = ({ url }: { url: string }) => {
  return (
    <a href={url} className="d-flex" rel="noopener noreferrer" target='_blank'>
      <img src="/assets/images/googleWallet.png" style={{ width: "auto", height: "48px" }} />
    </a>
  )
}

export { AppleWalletBtn, GoogleWalletBtn }