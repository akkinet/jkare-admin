"use client";
import React, { useState, useEffect } from "react";
import {
  FaChartLine,
  FaUsers,
  FaFileInvoiceDollar,
  FaStore,
  FaBox,
  FaUserCog,
  FaCog,
  FaUserShield,
  FaPrescription
} from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const [activeComponent, setActiveComponent] = useState("dashboard");
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
        <ul className="space-y-4 w-full">
          <li>
            <Link
              href="/"
              className={`w-full flex items-center p-2 rounded group ${
                activeComponent === "dashboard"
                  ? "bg-customPink text-white"
                  : "text-customDarkGray"
              } hover:bg-customPink hover:text-white`}
              onClick={() => handleSetActive("dashboard")}
            >
              <FaChartLine
                className={`text-xl ${
                  activeComponent === "dashboard"
                    ? "text-white"
                    : "text-customBlue"
                } group-hover:text-white`}
              />
              <span className="hidden md:inline ml-3">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/customer"
              className={`w-full flex items-center p-2 rounded group ${
                activeComponent === "customer"
                  ? "bg-customPink text-white"
                  : "text-customDarkGray"
              } hover:bg-customPink hover:text-white`}
              onClick={() => handleSetActive("customer")}
            >
              <FaUsers
                className={`text-xl ${
                  activeComponent === "customer"
                    ? "text-white"
                    : "text-customBlue"
                } group-hover:text-white`}
              />
              <span className="hidden md:inline ml-3">Customers</span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/prescription"
              className={`w-full flex items-center p-2 rounded group ${
                activeComponent === "prescription"
                  ? "bg-customPink text-white"
                  : "text-customDarkGray"
              } hover:bg-customPink hover:text-white`}
              onClick={() => handleSetActive("prescription")}
            >
              <FaPrescription
                className={`text-xl ${
                  activeComponent === "prescription"
                    ? "text-white"
                    : "text-customBlue"
                } group-hover:text-white`}
              />
              <span className="hidden md:inline ml-3">Prescription</span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/billing"
              className={`w-full flex items-center p-2 rounded group ${
                activeComponent === "billing"
                  ? "bg-customPink text-white"
                  : "text-customDarkGray"
              } hover:bg-customPink hover:text-white`}
              onClick={() => handleSetActive("billing")}
            >
              <FaFileInvoiceDollar
                className={`text-xl ${
                  activeComponent === "billing"
                    ? "text-white"
                    : "text-customBlue"
                } group-hover:text-white`}
              />
              <span className="hidden md:inline ml-3">Billing & Payments</span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/vendor"
              className={`w-full flex items-center p-2 rounded group ${
                activeComponent === "vendor"
                  ? "bg-customPink text-white"
                  : "text-customDarkGray"
              } hover:bg-customPink hover:text-white`}
              onClick={() => handleSetActive("vendor")}
            >
              <FaStore
                className={`text-xl ${
                  activeComponent === "vendor"
                    ? "text-white"
                    : "text-customBlue"
                } group-hover:text-white`}
              />
              <span className="hidden md:inline ml-3">Vendors</span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/products"
              className={`w-full flex items-center p-2 rounded group ${
                activeComponent === "products"
                  ? "bg-customPink text-white"
                  : "text-customDarkGray"
              } hover:bg-customPink hover:text-white`}
              onClick={() => handleSetActive("products")}
            >
              <FaBox
                className={`text-xl ${
                  activeComponent === "products"
                    ? "text-white"
                    : "text-customBlue"
                } group-hover:text-white`}
              />
              <span className="hidden md:inline ml-3">Products</span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/userManagement"
              className={`w-full flex items-center p-2 rounded group ${
                activeComponent === "userManagement"
                  ? "bg-customPink text-white"
                  : "text-customDarkGray"
              } hover:bg-customPink hover:text-white`}
              onClick={() => handleSetActive("userManagement")}
            >
              <FaUserCog
                className={`text-xl ${
                  activeComponent === "userManagement"
                    ? "text-white"
                    : "text-customBlue"
                } group-hover:text-white`}
              />
              <span className="hidden md:inline ml-3">User Management</span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/accountSettings"
              className={`w-full flex items-center p-2 rounded group ${
                activeComponent === "accountSettings"
                  ? "bg-customPink text-white"
                  : "text-customDarkGray"
              } hover:bg-customPink hover:text-white`}
              onClick={() => handleSetActive("accountSettings")}
            >
              <FaCog
                className={`text-xl ${
                  activeComponent === "accountSettings"
                    ? "text-white"
                    : "text-customBlue"
                } group-hover:text-white`}
              />
              <span className="hidden md:inline ml-3">Account Settings</span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/userRoles"
              className={`w-full flex items-center p-2 rounded group ${
                activeComponent === "userRoles"
                  ? "bg-customPink text-white"
                  : "text-customDarkGray"
              } hover:bg-customPink hover:text-white`}
              onClick={() => handleSetActive("userRoles")}
            >
              <FaUserShield
                className={`text-xl ${
                  activeComponent === "userRoles"
                    ? "text-white"
                    : "text-customBlue"
                } group-hover:text-white`}
              />
              <span className="hidden md:inline ml-3">User Roles</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
