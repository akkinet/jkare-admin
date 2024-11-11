"use client";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";

function Layout({ children }) {
  const pathname = usePathname();
  if (pathname == "/login") return <div>{children}</div>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 pl-2">
        <Navbar />
        {children}
      </div>
    </div>
  );
}

export default Layout;
