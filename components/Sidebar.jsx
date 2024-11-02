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
} from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const router = useRouter();

  useEffect(() => {
    if (router && router.pathname) {
      // Set active component based on current path, with fallback if path is '/'
      const currentPath = router.pathname.slice(1) || "dashboard";
      setActiveComponent(currentPath);
    }
  }, [router]);

  return (
    <div className="flex h-[100vh]">
      <div className="w-64 bg-customlightGray p-6 shadow-lg flex flex-col items-center">
        <div className="mb-8">
          <img
            className="lg:h-14 max-w-sm: h-9 lg:py-2"
            src="https://images.squarespace-cdn.com/content/v1/60aefe75c1a8f258e529fbac/1622081456984-G5MG4OZZJFVIM3R01YN7/jkare-2.png?format=1500w"
            alt="Jkare Logo"
          />
        </div>
        <ul className="space-y-4 w-full">
          <li>
            <Link href="/"
              className={`w-full flex items-center p-2 rounded group ${
                activeComponent === "dashboard"
                  ? "bg-customPink text-white"
                  : "text-customDarkGray"
              } hover:bg-customPink hover:text-white`}
            >
              <FaChartLine
                className={`mr-3 ${
                  activeComponent === "dashboard"
                    ? "text-white"
                    : "text-customBlue"
                } group-hover:text-white`}
              />
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/customer"
              className={`w-full flex items-center p-2 rounded group ${
                activeComponent === "customers"
                  ? "bg-customPink text-white"
                  : "text-customDarkGray"
              } hover:bg-customPink hover:text-white`}
            >
              <FaUsers
                className={`mr-3 ${
                  activeComponent === "customers"
                    ? "text-white"
                    : "text-customBlue"
                } group-hover:text-white`}
              />
              Customers
            </Link>
          </li>
          <li>
            <Link href="/billing"
              className={`w-full flex items-center p-2 rounded group ${
                activeComponent === "billing"
                  ? "bg-customPink text-white"
                  : "text-customDarkGray"
              } hover:bg-customPink hover:text-white`}
            >
              <FaFileInvoiceDollar
                className={`mr-3 ${
                  activeComponent === "billing"
                    ? "text-white"
                    : "text-customBlue"
                } group-hover:text-white`}
              />
              Billing & Payments
            </Link>
          </li>
          <li>
            <Link href="/vendors"
              className={`w-full flex items-center p-2 rounded group ${
                activeComponent === "vendors"
                  ? "bg-customPink text-white"
                  : "text-customDarkGray"
              } hover:bg-customPink hover:text-white`}
            >
              <FaStore
                className={`mr-3 ${
                  activeComponent === "vendors"
                    ? "text-white"
                    : "text-customBlue"
                } group-hover:text-white`}
              />
              Vendors
            </Link>
          </li>
          <li>
            <Link href="/products"
              className={`w-full flex items-center p-2 rounded group ${
                activeComponent === "products"
                  ? "bg-customPink text-white"
                  : "text-customDarkGray"
              } hover:bg-customPink hover:text-white`}
            >
              <FaBox
                className={`mr-3 ${
                  activeComponent === "products"
                    ? "text-white"
                    : "text-customBlue"
                } group-hover:text-white`}
              />
              Products
            </Link>
          </li>
          <li>
            <Link href="/userManagement"
              className={`w-full flex items-center p-2 rounded group ${
                activeComponent === "user-management"
                  ? "bg-customPink text-white"
                  : "text-customDarkGray"
              } hover:bg-customPink hover:text-white`}
            >
              <FaUserCog
                className={`mr-3 ${
                  activeComponent === "user-management"
                    ? "text-white"
                    : "text-customBlue"
                } group-hover:text-white`}
              />
              User Management
            </Link>
          </li>
          <li>
            <Link href="/accountSettings"
              className={`w-full flex items-center p-2 rounded group ${
                activeComponent === "account-settings"
                  ? "bg-customPink text-white"
                  : "text-customDarkGray"
              } hover:bg-customPink hover:text-white`}
            >
              <FaCog
                className={`mr-3 ${
                  activeComponent === "account-settings"
                    ? "text-white"
                    : "text-customBlue"
                } group-hover:text-white`}
              />
              Account Settings
            </Link>
          </li>
          <li>
            <Link href="/userRoles"
              className={`w-full flex items-center p-2 rounded group ${
                activeComponent === "user-roles"
                  ? "bg-customPink text-white"
                  : "text-customDarkGray"
              } hover:bg-customPink hover:text-white`}
            >
              <FaUserShield
                className={`mr-3 ${
                  activeComponent === "user-roles"
                    ? "text-white"
                    : "text-customBlue"
                } group-hover:text-white`}
              />
              User Roles
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
