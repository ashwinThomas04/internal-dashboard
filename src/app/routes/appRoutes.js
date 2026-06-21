import { Navigate, Route } from "react-router";

import HomePage from "../screens/home";
import AboutPage from "../screens/about";

const NavigateToApp = () => {
  return <Navigate to="/app/home" replace />
}

const appRoute = () => {
  return (
    <>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
    </>
  )
}

export { appRoute, NavigateToApp };