import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

function MainLayout() {
  return (
    <>
      <Navbar />

      <main
        style={{
          minHeight: "calc(100vh - 140px)",
        }}
      >
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default MainLayout;