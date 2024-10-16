import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { SidebarMain } from "../components/sidebar-main";

const PrimaryLayout = ({ children }) => {
    return (
        <div className="w-screen flex h-dvh">
            <div className="sticky top-0 bottom-0 flex-shrink-0 flex-grow-0 basis-auto">
                <SidebarMain />
            </div>
            <main className="flex-1 flex w-full overflow-x-hidden">
                <div className="flex-1 flex flex-col">
                    <Header fluid />
                    <div className="flex-1">{children}</div>
                    <Footer />
                </div>
            </main>
        </div>
    );
};
export default PrimaryLayout;
