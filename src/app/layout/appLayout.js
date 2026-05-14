import { Outlet } from "react-router";
import { BottomNav, Header } from "../components/navigation";
import { useAuth, useConfig } from "../context";
import { NavigateToAuth } from "../routes";
import { PageLoader } from "../container/loader";
import services from "../service";

const AppLayout = () => {
  const auth = useAuth();
  const config = useConfig();

  if (!config?.ui || !auth.isHydrated) return <PageLoader />
  if (!auth.isAuthenticated) return <NavigateToAuth />
  return (
    <>
      <Header />
      <div className="container px-0">
        <Outlet />
      </div>
      {services.deviceManager.isSmallDevice() ? <BottomNav /> : null}
    </>
  )
}

export default AppLayout;