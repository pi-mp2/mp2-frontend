import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./MainLayout.scss";

export default function MainLayout(): JSX.Element {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout__content">
        <Outlet />
      </main>
    </div>
  );
}
