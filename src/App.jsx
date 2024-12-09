import { Route, Router, Routes } from "react-router-dom";
import { authRoutes, privateRoutes, publicRoutes } from "./config/routes";
import { Fragment, Suspense } from "react";
import { LoadingThreeDot } from "./components/loadings/loading-three-dot.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthedPage } from "./components/authed-page.jsx";
import BlockAccessPage from "./components/block-access-page.jsx";

function App() {
	return (
		<div>
			<ToastContainer stacked />
			<Routes>
				{publicRoutes?.length > 0 &&
					publicRoutes?.map((route, index) => {
						const Component = route.component;
						const Layout = route.layout ? route.layout : Fragment;
						return (
							<Route
								key={index}
								path={route.path}
								element={
									<Layout>
										<Suspense fallback={<LoadingThreeDot />}>
											<Component />
										</Suspense>
									</Layout>
								}
							/>
						);
					})}

				{privateRoutes?.length > 0 &&
					privateRoutes?.map((route, index) => {
						const Component = route.component;
						const Layout = route.layout ? route.layout : Fragment;
						return (
							<Route
								key={index}
								path={route.path}
								element={
									<AuthedPage>
										<Layout>
											<Suspense fallback={<LoadingThreeDot />}>
												<Component />
											</Suspense>
										</Layout>
									</AuthedPage>
								}
							/>
						);
					})}

				{authRoutes?.length > 0 &&
					authRoutes?.map((route, index) => {
						const Component = route.component;
						const Layout = route.layout ? route.layout : Fragment;

						return (
							<Route
								key={index}
								path={route.path}
								element={
									<BlockAccessPage>
										<Layout>
											<Suspense fallback={<LoadingThreeDot />}>
												<Component />
											</Suspense>
										</Layout>
									</BlockAccessPage>
								}
							/>
						);
					})}
			</Routes>
		</div>
	);
}

export default App;
