import { NavBar } from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import "bootstrap/dist/css/bootstrap.min.css";

type Props = {
  children: React.ReactNode;
};
export const PageLayout = ({ children }: Props) => {
  console.log("layout loads");
  return (
    <div className="layout_container justify-content-between d-flex flex-column w-100 ">
      <NavBar />
      <div className="layout_container--inner h-100">{children}</div>
      <Footer />
    </div>
  );
};
