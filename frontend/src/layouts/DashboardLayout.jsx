import { Outlet } from "react-router";
import { Header } from "../components";

const DashboardLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default DashboardLayout;
