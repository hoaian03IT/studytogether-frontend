import { Route, Routes } from "react-router-dom";
import { publicRoutes } from "./config/routes";
import { Suspense } from "react";
import { Loading } from "./components/loading";

function App() {
    return (
        <div >
            <Routes>
                {publicRoutes.map((route) => {
                    const Component = route.component;
                    return (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={
                                <Suspense fallback={<Loading />}>
                                    <Component />
                                </Suspense>
                            }
                        />
                    );
                })}
            </Routes>
        </div>
    );
}

export default App;
