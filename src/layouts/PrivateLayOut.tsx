import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PrivateLayout(): JSX.Element {
  return (
    <>
      <Navbar isPrivate={true} />
      <Outlet />
      <Footer />
    </>
  );
}
