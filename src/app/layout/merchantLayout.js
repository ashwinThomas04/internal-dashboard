import { Outlet } from "react-router";
import { Header } from "../components/navigation";
import { useConfig } from "../context";
import { PageLoader } from "../container/loader";

const MerchantLayout = () => {
  const config = useConfig();

  if (!config?.ui) return <PageLoader />
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export default MerchantLayout;