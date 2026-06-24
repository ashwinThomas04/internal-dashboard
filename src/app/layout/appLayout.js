import { Outlet } from "react-router";
import { Text } from "../components/typography";

const AppLayout = () => {
  return (
    <>
      <div className="container px-0">
        <Outlet />
      </div>
      <div className="container-fluid py-3 d-flex justify-content-center">
        <Text size="paragraph-xs" color="muted">All Rights Reserved | © Qubriux {new Date().getFullYear()}</Text>
      </div>
    </>
  )
}

export default AppLayout;