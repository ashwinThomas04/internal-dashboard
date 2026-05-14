import { Navigate, Route } from "react-router";

import HomePage from "../screens/home";

const NavigateToApp = () => {
  return <Navigate to="/app/home" replace />
}

const appRoute = () => {
  return (
    <>
      <Route path="/" element={<HomePage />} />
    </>
  )
}

export { appRoute, NavigateToApp };