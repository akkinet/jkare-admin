"use client";
import React, { useState } from "react";
import {
  FaShoppingBag,
  FaUsers,
  FaFileInvoiceDollar,
  FaStore,
  FaBox,
  FaUserCog,
  FaCog,
  FaUserShield,
} from "react-icons/fa";
import Dashboard from "../components/pages/dashboard";
import Customers from "../components/pages/customers";

const Sidebar = () => {
  const [activeComponent, setActiveComponent] = useState("orders");

  // Function to render the correct component based on active state
  const renderComponent = () => {
    switch (activeComponent) {
      case "orders":
        return <Dashboard />;
      case "customers":
        return <Customers />;
      // case "billing":
      //   return <Billing />;
      // case "vendors":
      //   return <Vendors />;
      // case "products":
      //   return <Products />;
      // case "user-management":
      //   return <UserManagement />;
      // case "account-settings":
      //   return <AccountSettings />;
      // case "user-roles":
      //   return <UserRoles />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-[100vh]">
      {/* Sidebar */}
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
            <button
              className={`w-full flex items-center p-2 rounded group ${
                activeComponent === "orders"
                  ? "bg-customPink text-white"
                  : "text-customDarkGray"
              } hover:bg-customPink hover:text-white`}
              onClick={() => setActiveComponent("orders")}
            >
              <FaShoppingBag
                className={`mr-3 ${
                  activeComponent === "orders"
                    ? "text-white"
                    : "text-customBlue"
                } group-hover:text-white`}
              />{" "}
              Orders
            </button>
          </li>
          <li>
            <button
              className={`w-full flex items-center p-2 rounded group ${
                activeComponent === "customers"
                  ? "bg-customPink text-white"
                  : "text-customDarkGray"
              } hover:bg-customPink hover:text-white`}
              onClick={() => setActiveComponent("customers")}
            >
              <FaUsers
                className={`mr-3 ${
                  activeComponent === "customers"
                    ? "text-white"
                    : "text-customBlue"
                } group-hover:text-white`}
              />{" "}
              Customers
            </button>
          </li>
          <li>
            <button
              className={`w-full flex items-center p-2 rounded group ${
                activeComponent === "billing"
                  ? "bg-customPink text-white"
                  : "text-customDarkGray"
              } hover:bg-customPink hover:text-white`}
              onClick={() => setActiveComponent("billing")}
            >
              <FaFileInvoiceDollar
                className={`mr-3 ${
                  activeComponent === "billing"
                    ? "text-white"
                    : "text-customBlue"
                } group-hover:text-white`}
              />{" "}
              Billing & Payments
            </button>
          </li>
          <li>
            <button
              className={`w-full flex items-center p-2 rounded group ${
                activeComponent === "vendors"
                  ? "bg-customPink text-white"
                  : "text-customDarkGray"
              } hover:bg-customPink hover:text-white`}
              onClick={() => setActiveComponent("vendors")}
            >
              <FaStore
                className={`mr-3 ${
                  activeComponent === "vendors"
                    ? "text-white"
                    : "text-customBlue"
                } group-hover:text-white`}
              />{" "}
              Vendors
            </button>
          </li>
          <li>
            <button
              className={`w-full flex items-center p-2 rounded group ${
                activeComponent === "products"
                  ? "bg-customPink text-white"
                  : "text-customDarkGray"
              } hover:bg-customPink hover:text-white`}
              onClick={() => setActiveComponent("products")}
            >
              <FaBox
                className={`mr-3 ${
                  activeComponent === "products"
                    ? "text-white"
                    : "text-customBlue"
                } group-hover:text-white`}
              />{" "}
              Products
            </button>
          </li>
          <li>
            <button
              className={`w-full flex items-center p-2 rounded group ${
                activeComponent === "user-management"
                  ? "bg-customPink text-white"
                  : "text-customDarkGray"
              } hover:bg-customPink hover:text-white`}
              onClick={() => setActiveComponent("user-management")}
            >
              <FaUserCog
                className={`mr-3 ${
                  activeComponent === "user-management"
                    ? "text-white"
                    : "text-customBlue"
                } group-hover:text-white`}
              />{" "}
              User Management
            </button>
          </li>
          <li>
            <button
              className={`w-full flex items-center p-2 rounded group ${
                activeComponent === "account-settings"
                  ? "bg-customPink text-white"
                  : "text-customDarkGray"
              } hover:bg-customPink hover:text-white`}
              onClick={() => setActiveComponent("account-settings")}
            >
              <FaCog
                className={`mr-3 ${
                  activeComponent === "account-settings"
                    ? "text-white"
                    : "text-customBlue"
                } group-hover:text-white`}
              />{" "}
              Account Settings
            </button>
          </li>
          <li>
            <button
              className={`w-full flex items-center p-2 rounded group ${
                activeComponent === "user-roles"
                  ? "bg-customPink text-white"
                  : "text-customDarkGray"
              } hover:bg-customPink hover:text-white`}
              onClick={() => setActiveComponent("user-roles")}
            >
              <FaUserShield
                className={`mr-3 ${
                  activeComponent === "user-roles"
                    ? "text-white"
                    : "text-customBlue"
                } group-hover:text-white`}
              />{" "}
              User Roles
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className=" p-1 flex-1">{renderComponent()}</div>
    </div>
  );
};

export default Sidebar;
