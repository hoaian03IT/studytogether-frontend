import { Route, Routes } from "react-router-dom";
import { publicRoutes } from "./config/routes";
import { Suspense } from "react";
import { Loading } from "./components/loading";

function App() {
    return (
        <div className="h-screen w-screen flex justify-center items-center flex-col gap-32">
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
