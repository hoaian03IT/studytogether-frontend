import { Header } from "../components/header";

const PrimaryLayout = ({ children }) => {
  return (
    <div className="w-screen">
      <Header />
      <main className="mt-16 container flex justify-center items-center w-full">
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
};
export default PrimaryLayout;
