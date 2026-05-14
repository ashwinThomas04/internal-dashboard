import { BrowserRouter, Routes } from "react-router";
import { ModalProvider } from "./components/modal";
import { AlertsProvider } from "./components/alerts";
import { ConfigProvider, AuthProvider, CacheProvider } from "./context";

import { appRoute } from "./routes";
import Initialiser from "./initialiser";

const App = () => {

	return (
		<Routes>
			{appRoute()}
		</Routes>
	)
}

const AppWrapper = () => {

	return (
		<ConfigProvider>
			<CacheProvider>
				<AuthProvider>
					<ModalProvider>
						<AlertsProvider>
							<div className="qb-text-dark qb-bg-light qb-fs-paragraph-md qb-fw-regular mvh-100 position-relative w-100">
								<BrowserRouter>
									<Initialiser />
									<App />
								</BrowserRouter>
							</div>
						</AlertsProvider>
					</ModalProvider>
				</AuthProvider>
			</CacheProvider>
		</ConfigProvider>
	)
}

export default AppWrapper;