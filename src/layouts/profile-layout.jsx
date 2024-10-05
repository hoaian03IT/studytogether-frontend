import { Header } from "../components/header";
import { SidebarProfile } from "../components/sidebar-profile";

export default function ProfileLayout({ children }) {
    return (
        <div className="w-screen">
            <Header />
            <main className="mt-16 relative container">
                <div className="fixed top-16 bottom-0 w-[300px]">
                    <SidebarProfile />
                </div>
                <div className="w-[calc(100%-300px)] ms-auto">{children}</div>
            </main>
        </div>
    );
}
