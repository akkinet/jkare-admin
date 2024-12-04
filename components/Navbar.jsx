"use client";
import { useState } from "react";
import {
  FaUserCircle,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaUserAlt,
  FaQuestionCircle,
} from "react-icons/fa";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState(2);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

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
      <div className="flex items-center cursor-pointer" onClick={toggleDropdown}>
        {/* User Image */}
        <div className="relative w-10 h-10 overflow-hidden rounded-full mr-2">
          {session ? (
            <Image
              src={session.user.image}
              alt={session.user.name}
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
          ) : (
            <Link href="/login">
              <FaUserCircle className="text-gray-600" size={40} />
            </Link>
          )}
        </div>

        {/* Welcome Message */}
        {session && (
          <span className="text-gray-700 font-medium ">
            Welcome,<div className="text-sm"> {session.user.name}</div>
          </span>
        )}
      </div>

      {/* Dropdown Menu */}
      {session && showDropdown && (
        <div className="absolute right-10 top-16 w-64 bg-white shadow-lg rounded-lg mt-2 z-50">
          <div className="flex items-center p-4 border-b border-gray-200">
            <div>
              <p className="font-semibold">{session.user.name}</p>
              <p className="text-sm text-gray-500">{session.user.email}</p>
              <p className="text-sm text-white bg-customPink p-1 shadow-md hover:bg-customBlue hover:shadow-lg transition duration-300 ease-in-out">
                Role : {session.user.role}
              </p>
            </div>
          </div>
          <div className="flex flex-col p-2">
            <Link href="/profile" target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-2 hover:bg-gray-100 rounded-md">
              <FaUserAlt className="mr-2 text-gray-600" /> View Profile

            </Link>
            <button className="flex items-center p-2 hover:bg-gray-100 rounded-md">
              <FaCog className="mr-2 text-gray-600" /> Account Settings
            </button>
            <button className="flex items-center p-2 hover:bg-gray-100 rounded-md">
              <FaBell className="mr-2 text-gray-600" /> Notifications
            </button>
            <button className="flex items-center p-2 hover:bg-gray-100 rounded-md">
              <FaQuestionCircle className="mr-2 text-gray-600" /> Help Center
            </button>
            <button onClick={() => signOut()} className="flex items-center p-2 hover:bg-gray-100 rounded-md">
              <FaSignOutAlt
                className="mr-2 text-gray-600"
              />{" "}
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
