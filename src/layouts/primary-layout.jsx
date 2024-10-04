import { Header } from "../components/header";
import SideBar from "../components/SideBar";

const PrimaryLayout = ({ children }) => {
  return (
    <div className="w-screen">
      <Header />
      <main className="container flex justify-center items-center min-h-screen w-full">
        <div className="flex items-start gap-10 w-full">
          <SideBar />
          {children}
        </div>
      </main>
    </div>
  );
};
export default PrimaryLayout;
