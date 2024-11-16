import { Header } from "../components/header";
import { SidebarListExercise } from "../components/sidebar-listexercise";

export default function ListExerciseLayout({ children }) {
    return (
        <div className="w-screen">
            <Header />
            <main className="mt-16 relative container">
                <div className="fixed top-16 bottom-0 w-[300px]">
                    <SidebarListExercise />
                </div>
                <div className="w-[calc(100%-300px)] ms-auto">{children}</div>
            </main>
        </div>
    );
}
