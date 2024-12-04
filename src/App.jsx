import { Route, Routes } from "react-router-dom";
import { publicRoutes } from "./config/routes";
import { Fragment, Suspense } from "react";
import { LoadingThreeDot } from "./components/loadings/loading-three-dot.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
	return (
		<div>
			<Routes>
				{publicRoutes?.map((route) => {
					const Component = route.component;
					const Layout = route.layout ? route.layout : Fragment;
					return (
						<Route
							key={route.path}
							path={route.path}
							element={
								<Layout>
									<Suspense fallback={<LoadingThreeDot />}>
										<Component />
									</Suspense>
									<ToastContainer stacked />
								</Layout>
							}
						/>
					);
				})}
			</Routes>
		</div>
	);
}

export default App;
