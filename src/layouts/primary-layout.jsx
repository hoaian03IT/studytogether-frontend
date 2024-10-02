import { Header } from "../components/header";

const PrimaryLayout = ({ children }) => {
    return (
        <div className="w-screen">
            <Header />
            <main className="mt-[var(--navbar-height)]">{children}</main>
        </div>
    );
};
export default PrimaryLayout;
