"use client";
import React, { useState, useEffect } from "react";
import {
  FaChartLine,
  FaUsers,
  FaFileInvoiceDollar,
  FaStore,
  FaBox,
  FaUserCog,
  FaUserShield,
  FaPrescription,
  FaShoppingCart,
} from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const Sidebar = () => {
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (router && router.pathname) {
      const currentPath = router.pathname.slice(1) || "dashboard";
      setActiveComponent(currentPath);
    }
  }, [router]);

  const handleSetActive = (component) => {
    setActiveComponent(component);
  };

  // Role-based menu items
  const role = session?.user?.role || "Super Admin";

  const menuItems = {
    "Super Admin": [
      { href: "/", label: "Dashboard", icon: FaChartLine, key: "dashboard" },
      { href: "/dashboard/customer", label: "Customers", icon: FaUsers, key: "customer" },
      { href: "/dashboard/orders", label: "Orders", icon: FaShoppingCart, key: "orders" },
      { href: "/dashboard/prescription", label: "Prescription", icon: FaPrescription, key: "prescription" },
      { href: "/dashboard/billing", label: "Billing & Payments", icon: FaFileInvoiceDollar, key: "billing" },
      { href: "/dashboard/vendor", label: "Vendors", icon: FaStore, key: "vendor" },
      { href: "/dashboard/products", label: "Products", icon: FaBox, key: "products" },
      { href: "/dashboard/userManagement", label: "User Management", icon: FaUserCog, key: "userManagement" },
      { href: "/dashboard/userRoles", label: "User Roles", icon: FaUserShield, key: "userRoles" },
      { href: "/dashboard/globalSettings", label: "Global Settings", icon: IoSettings, key: "globalSettings" },
    ],
    Analyst: [
      { href: "/", label: "Dashboard", icon: FaChartLine, key: "dashboard" },
      { href: "/dashboard/orders", label: "Orders", icon: FaShoppingCart, key: "orders" },
      { href: "/dashboard/prescription", label: "Prescription", icon: FaPrescription, key: "prescription" },
    ],
    "Billing Specialist": [
      { href: "/", label: "Dashboard", icon: FaChartLine, key: "dashboard" },
      { href: "/dashboard/customer", label: "Customers", icon: FaUsers, key: "customer" },
      { href: "/dashboard/orders", label: "Orders", icon: FaShoppingCart, key: "orders" },
      { href: "/dashboard/billing", label: "Billing & Payments", icon: FaFileInvoiceDollar, key: "billing" },
    ],
  };

  const visibleMenuItems = menuItems[role] || [];

  if (status === "loading") {
    // **Skeletal Loader** while session is being fetched
    return (
      <div className="flex h-[100vh]">
        <div className="bg-customlightGray p-4 shadow-lg flex flex-col items-center w-20 md:w-64 lg:w-64 animate-pulse">
          <div className="mb-8 w-full flex justify-center">
            <div className="h-14 w-14 bg-gray-300 rounded-md"></div>
          </div>
          <div className="h-5 w-32 bg-gray-300 rounded mb-6"></div>
          <ul className="space-y-4 w-full">
            {Array(7)
              .fill(0)
              .map((_, idx) => (
                <li key={idx} className="flex items-center space-x-4 p-2">
                  <div className="h-8 w-8 bg-gray-300 rounded"></div>
                  <div className="h-4 w-24 bg-gray-300 rounded hidden md:block"></div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[100vh]">
      <div className="bg-customlightGray p-4 shadow-lg flex flex-col items-center transition-all duration-300 ease-in-out w-20 md:w-64 lg:w-64">
        <div className="mb-8">
          <img
            className="h-8 md:hidden"
            src="https://s3.ap-south-1.amazonaws.com/medicom.hexerve/jkare+logo+icon.png"
            alt="Jkare Icon Logo"
          />
          <img
            className="hidden md:block h-14 lg:py-2"
            src="https://s3.ap-south-1.amazonaws.com/medicom.hexerve/jkare-2.png"
            alt="Jkare Logo"
          />
        </div>
        {/* <div>Role: {role}</div> */}
        <ul className="space-y-4 w-full">
          {visibleMenuItems.map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                className={`w-full flex items-center p-2 rounded group ${
                  activeComponent === item.key
                    ? "bg-customPink text-white"
                    : "text-customDarkGray"
                } hover:bg-customPink hover:text-white`}
                onClick={() => handleSetActive(item.key)}
              >
                <item.icon
                  className={`text-xl ${
                    activeComponent === item.key
                      ? "text-white"
                      : "text-customBlue"
                  } group-hover:text-white`}
                />
                <span className="hidden md:inline ml-3">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
