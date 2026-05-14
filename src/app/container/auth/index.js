import { useAuth, useConfig } from "../../context";
import { Title } from "../../components/meta";
import { Text } from "../../components/typography";
import { TextLink } from "../../components/cta";

const AuthWrapper = ({ children, size = 4, title = "", showTerms }) => {
  const config = useConfig();
  const auth = useAuth();

  return (
    <>
      <Title>{`${auth?.store?.storeName}${title ? ` | ${title}` : ""}`}</Title>
      <div className="container-fluid mvh-100 px-4 px-sm-0 qb-auth-wrapper">
        <div className="row justify-content-center mvh-100">
          <div className={`col-12 col-sm-11 col-md-${size + 2} col-lg-${size + 1} col-xl-${size}`}>
            <div className="w-100 h-100 d-flex justify-content-center flex-column pb-5 pt-3 gap-3">
              {
                config?.branding?.logo ?
                  <div className="d-flex flex-column align-items-center py-4">
                    <img className="qb-auth-layout-logo" src={config.branding.logo} alt={auth?.store?.storeName} />
                  </div>
                  :
                  null
              }
              <div className="qb-bg-card-grad position-relative qb-border-solid-grey qb-br-16 qb-shadow-sm w-100">
                <div className="w-100 h-100 overflow-hidden qb-br-16 position-absolute pointer-none qb-top-0 qb-left-0">
                  <div className="position-absolute w-100 qb-bg-primary qb-top-0 qb-left-0 pt-1"></div>
                </div>
                <div className="p-4 w-100">
                  {children}
                </div>
              </div>
              {
                showTerms ?
                  <div className="pt-6 pb-4 d-flex align-items-center justify-content-center">
                    <Text size="tag" color="muted" align="center">
                      By continuing, you agree to our <TextLink size="xs" as="router" to="/loyalty/terms-of-use">Terms of Use</TextLink> and <TextLink size="xs" as="router" to="/loyalty/privacy-policy">Privacy Policy</TextLink>
                    </Text>
                  </div>
                  :
                  null
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AuthWrapper;