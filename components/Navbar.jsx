"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserCircle, FaBell, FaCog, FaSignOutAlt, FaUserAlt, FaQuestionCircle } from "react-icons/fa";
import Image from "next/image";

export default function Navbar({ isLoggedIn, user }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState(2);
  const router = useRouter();

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleLoginRedirect = () => {
    if (!isLoggedIn) {
      router.push("/login"); // Redirect to the login page
    }
  };

  return (
    <div className="flex items-center p-4 px-8 bg-gray-100 border-b border-gray-300 justify-end">
      {/* Notification Icon */}
      <div className="relative mr-4 cursor-pointer">
        <FaBell className="text-gray-600" size={24} />
        {notifications > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
            {notifications}
          </span>
        )}
      </div>

      {/* User Icon */}
      <div
        className="cursor-pointer"
        onClick={isLoggedIn ? toggleDropdown : handleLoginRedirect}
      >
        {isLoggedIn ? (
          <Image
            src={user.image}
            alt={user.name}
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <FaUserCircle className="text-gray-600" size={40} />
        )}
      </div>

      {/* Dropdown Menu */}
      {showDropdown && isLoggedIn && (
        <div className="absolute right-10 top-16 w-64 bg-white shadow-lg rounded-lg mt-2 z-10">
          <div className="flex items-center p-4 border-b border-gray-200">
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-sm text-white bg-customPink p-1 shadow-md hover:bg-customBlue hover:shadow-lg transition duration-300 ease-in-out">
                Role: {user.role}
              </p>
            </div>
          </div>
          <div className="flex flex-col p-2">
            <button className="flex items-center p-2 hover:bg-gray-100 rounded-md">
              <FaUserAlt className="mr-2 text-gray-600" /> View Profile
            </button>
            <button className="flex items-center p-2 hover:bg-gray-100 rounded-md">
              <FaCog className="mr-2 text-gray-600" /> Account Settings
            </button>
            <button className="flex items-center p-2 hover:bg-gray-100 rounded-md">
              <FaBell className="mr-2 text-gray-600" /> Notifications
            </button>
            <button className="flex items-center p-2 hover:bg-gray-100 rounded-md">
              <FaQuestionCircle className="mr-2 text-gray-600" /> Help Center
            </button>
            <button className="flex items-center p-2 hover:bg-gray-100 rounded-md">
              <FaSignOutAlt className="mr-2 text-gray-600" /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
