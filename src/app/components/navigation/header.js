import { Link, NavLink } from "react-router";
import { useAuth, useConfig } from "../../context";
import { Text } from "../typography";
import { Avatar } from "../avatar";

const Header = () => {
  const config = useConfig();
  const auth = useAuth();

  return (
    <>
      <div className="container-fluid px-0 position-fixed qb-top-0 qb-left-0 qb-z-header qb-bg-card-grad qb-shadow-sm qb-border-solid-grey">
        <div className="container px-4 qb-app-header-size d-flex align-items-center justify-content-between">
          <Link to="/" className="text-decoration-none qb-text-dark qb-fs-paragraph-lg qb-fw-black">{
            config?.ui?.useHeaderLogo ?
              <img src={config?.branding?.header} alt={config.ui.dashboardTitle ? config.ui.dashboardTitle : auth?.data?.storeName} className="qb-header-brand-logo" />
              : config?.ui?.dashboardTitle ? config.ui.dashboardTitle : auth?.data?.storeName
          }</Link>
          {
            auth?.isAuthenticated ?
              <>
                <div className="d-md-flex gap-4 px-4 d-none">
                  {
                    config?.header?.map((item) => {
                      if (!item.isEnabled) return null;
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          className={({ isActive }) =>
                            `text-decoration-none qb-fs-paragraph-md qb-fw-regular qb-nav-link-item position-relative overflow-hidden py-1 ${isActive ? "qb-nav-link-item-active" : ""}`
                          }>
                          {item.label}
                        </NavLink>
                      )
                    })
                  }
                </div>

                <Link className="text-decoration-none" to="/app/profile">
                  {
                    auth?.user?.initials ?
                      <div className="p-1 qb-br-64 qb-border-solid-grey qb-bg-white d-flex align-items-center justify-content-center gap-2">
                        <Avatar size="md" initials={auth.user.initials} />
                        {/* <Text size="paragraph-xs" weight="bold" className="pe-2">{auth.user.name}</Text> */}
                      </div>
                      :
                      <Text weight="bold">Profile</Text>
                  }
                </Link>
              </>
              :
              <Link className="text-decoration-none qb-text-dark qb-fs-paragraph-md qb-fw-bold" to="/auth/signup">Sign up</Link>
          }
        </div>
      </div>
      <div className="qb-app-header-size w-100"></div>
    </>
  )
}

export default Header;