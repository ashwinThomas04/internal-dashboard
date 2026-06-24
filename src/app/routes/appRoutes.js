import { Navigate, Route } from "react-router";

import HomePage from "../screens/home";
import AboutPage from "../screens/about";
import AppLayout from "../layout/appLayout";

const NavigateToApp = () => {
  return <Navigate to="/" replace />
}

const appRoute = () => {
  return (
    <Route path="/" element={<AppLayout />}>
      <Route index element={<HomePage />} />
      <Route path="/wiki/customer-dashboard" element={<AboutPage />} />
      <Route path="*" element={<NavigateToApp />} />
    </Route>
  )
}

export { appRoute, NavigateToApp };