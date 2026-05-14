import { NavLink } from "react-router";
import { useConfig } from "../../context";

const navIcon = {
  "home": <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 26V20C19 19.7348 18.8946 19.4805 18.7071 19.2929C18.5196 19.1054 18.2652 19 18 19H14C13.7348 19 13.4804 19.1054 13.2929 19.2929C13.1054 19.4805 13 19.7348 13 20V26C13 26.2652 12.8946 26.5196 12.7071 26.7071C12.5196 26.8947 12.2652 27 12 27H6C5.73478 27 5.48043 26.8947 5.29289 26.7071C5.10536 26.5196 5 26.2652 5 26V14.4375C5.00224 14.2991 5.03215 14.1626 5.08796 14.0359C5.14378 13.9093 5.22437 13.7951 5.325 13.7L15.325 4.61252C15.5093 4.44387 15.7501 4.35034 16 4.35034C16.2499 4.35034 16.4907 4.44387 16.675 4.61252L26.675 13.7C26.7756 13.7951 26.8562 13.9093 26.912 14.0359C26.9679 14.1626 26.9978 14.2991 27 14.4375V26C27 26.2652 26.8946 26.5196 26.7071 26.7071C26.5196 26.8947 26.2652 27 26 27H20C19.7348 27 19.4804 26.8947 19.2929 26.7071C19.1054 26.5196 19 26.2652 19 26Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  "points": <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 28C16.866 28 20 22.6274 20 16C20 9.37258 16.866 4 13 4C9.13401 4 6 9.37258 6 16C6 22.6274 9.13401 28 13 28Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13 4H19C22.8625 4 26 9.375 26 16C26 22.625 22.8625 28 19 28H13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.2125 8H24.2125" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 16H26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.2125 24H24.2125" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  "orders": <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M27 9H5C4.44772 9 4 9.44772 4 10V26C4 26.5523 4.44772 27 5 27H27C27.5523 27 28 26.5523 28 26V10C28 9.44772 27.5523 9 27 9Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11 13V9C11 7.67392 11.5268 6.40215 12.4645 5.46447C13.4021 4.52678 14.6739 4 16 4C17.3261 4 18.5979 4.52678 19.5355 5.46447C20.4732 6.40215 21 7.67392 21 9V13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  "offers": <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 7V25" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.00002 20.9C2.99874 20.6697 3.078 20.4462 3.22409 20.2682C3.37018 20.0901 3.5739 19.9687 3.80002 19.925C4.69941 19.734 5.50594 19.24 6.08465 18.5255C6.66336 17.811 6.97913 16.9194 6.97913 16C6.97913 15.0806 6.66336 14.189 6.08465 13.4745C5.50594 12.76 4.69941 12.266 3.80002 12.075C3.5739 12.0313 3.37018 11.9099 3.22409 11.7318C3.078 11.5538 2.99874 11.3303 3.00002 11.1V8C3.00002 7.73478 3.10537 7.48043 3.29291 7.29289C3.48044 7.10536 3.7348 7 4.00002 7H28C28.2652 7 28.5196 7.10536 28.7071 7.29289C28.8947 7.48043 29 7.73478 29 8V11.1C29.0013 11.3303 28.922 11.5538 28.7759 11.7318C28.6299 11.9099 28.4261 12.0313 28.2 12.075C27.3006 12.266 26.4941 12.76 25.9154 13.4745C25.3367 14.189 25.0209 15.0806 25.0209 16C25.0209 16.9194 25.3367 17.811 25.9154 18.5255C26.4941 19.24 27.3006 19.734 28.2 19.925C28.4261 19.9687 28.6299 20.0901 28.7759 20.2682C28.922 20.4462 29.0013 20.6697 29 20.9V24C29 24.2652 28.8947 24.5196 28.7071 24.7071C28.5196 24.8946 28.2652 25 28 25H4.00002C3.7348 25 3.48044 24.8946 3.29291 24.7071C3.10537 24.5196 3.00002 24.2652 3.00002 24V20.9Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
}

const BottomNav = () => {
  const config = useConfig();
  return (
    <>
      <div className="container-fluid px-0 position-fixed qb-bottom-0 qb-left-0 qb-z-header qb-bg-card-grad qb-shadow-sm qb-border-solid-grey">
        <div className="container px-4 qb-app-header-size d-flex align-items-center justify-content-between">
          {
            config?.header?.map((item) => {
              if (!item.isEnabled) return null;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `text-decoration-none position-relative qb-bottom-nav-item d-flex flex-column align-items-center justify-content-center ${isActive ? "qb-bottom-nav-item-active" : ""}`
                  }>
                  <div className="position-absolute qb-top-0 qb-left-0 w-100 qb-bottom-nav-active-indicator qb-bg-primary"></div>
                  {navIcon[item.id]}
                  <p className="qb-fs-tag text-uppercase qb-bottom-nav-label qb-fw-semi-bold">{item.label}</p>
                </NavLink>
              )
            })
          }
        </div>
      </div>
      <div className="qb-app-header-size w-100"></div>
    </>
  )
}

export default BottomNav;