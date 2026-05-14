import { Outlet } from "react-router";
import { useConfig } from "../context";
import { PageLoader } from "../container/loader";

const AuthLayout = () => {
  const { ui } = useConfig();

  if (!ui) return <PageLoader />
  return (
    <Outlet />
  )
}

export default AuthLayout;