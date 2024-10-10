import { Header } from "../components/header";
import { SidebarMain } from "../components/sidebar-main";

const PrimaryLayout = ({ children }) => {
    return (
        <div className="w-screen flex flex-col h-dvh">
            <Header fluid />
            <main className="flex-1 flex w-full overflow-x-hidden">
                <div className="sticky top-0 bottom-0 flex-shrink-0 flex-grow-0 basis-auto">
                    <SidebarMain />
                </div>
                <div className="flex-1">{children}</div>
            </main>
        </div>
    );
};
export default PrimaryLayout;
