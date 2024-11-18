"use client";
import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";

const useResponsiveBackground = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)"); // Tailwind's sm breakpoint

    const handleMediaQueryChange = (event) => {
      setIsSmallScreen(event.matches);
    };

    // Set initial value
    setIsSmallScreen(mediaQuery.matches);

    // Listen for changes
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return isSmallScreen;
};

const page = () => {
  const isSmallScreen = useResponsiveBackground();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: "/dashboard",
      });
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <div
      className="flex h-screen justify-center items-center"
      style={{
        backgroundImage: isSmallScreen
          ? "url(https://s3.ap-south-1.amazonaws.com/medicom.hexerve/login+background.jpg)"
          : "url(https://s3.ap-south-1.amazonaws.com/medicom.hexerve/login+background.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-col md:flex-row h-full w-full md:h-3/4 md:w-3/4 shadow-lg bg-white rounded-lg overflow-hidden">
        <div
          className={`flex-1 flex flex-col justify-center items-center p-6 md:p-12 relative ${
            isSmallScreen ? "bg-cover bg-center text-white" : ""
          }`}
          style={{
            backgroundImage: isSmallScreen
              ? "url(https://s3.ap-south-1.amazonaws.com/medicom.hexerve/login+background.jpg)"
              : "none",
          }}
        >
          <h2
            className={`text-3xl md:text-4xl font-bold mb-4 md:mb-6 ${
              isSmallScreen ? "text-white" : "text-customBlue"
            }`}
          >
            Login
          </h2>
          <form
            onSubmit={submitHandler}
            method="POST"
            className="w-full max-w-xs md:max-w-md relative"
          >
            <label
              htmlFor="email"
              className={`block mb-2 font-bold ${
                isSmallScreen ? "text-white" : "text-customBlue"
              }`}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              placeholder="Enter your Email"
              className="w-full p-2 md:p-3 mb-4 md:mb-6 border border-customBlue rounded text-black"
            />
            <label
              htmlFor="password"
              className={`block mb-2 font-bold ${
                isSmallScreen ? "text-white" : "text-customBlue"
              }`}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              placeholder="Enter your Password"
              className="w-full p-2 md:p-3 mb-4 md:mb-6 border border-customBlue rounded text-black"
              required
            />

            <button
              href="#_"
              type="submit"
              className="relative rounded w-full px-5 py-2.5 overflow-hidden group bg-customBlue hover:bg-gradient-to-r hover:from-customBlue hover:to-customPink text-white hover:ring-2 hover:ring-offset-2 hover:ring-customPink transition-all ease-out duration-300"
            >
              <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              <span className="relative">Log In</span>
            </button>

            <a
              href="#"
              className={`block mt-2 md:mt-4 text-center ${
                isSmallScreen ? "text-white" : "text-pink-500"
              }`}
            >
              Forgot Password? Contact your (Super Admin)
            </a>
          </form>
          {isSmallScreen && (
            <div className="absolute top-0 left-0 m-4">
              <img
                src="https://s3.ap-south-1.amazonaws.com/medicom.hexerve/jkare-2.png"
                alt="Logo"
                className="h-12"
              />
            </div>
          )}
        </div>
        <div
          className="flex-1 lg:flex justify-center items-center relative hidden md:flex"
          style={{
            backgroundImage:
              "url(https://png.pngtree.com/thumb_back/fw800/background/20231229/pngtree-delicate-pastel-triangles-light-pink-and-blue-gradient-texture-image_13909059.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black opacity-0"></div>
          <div className="absolute top-0 left-0 m-4">
            <img
              src="https://s3.ap-south-1.amazonaws.com/medicom.hexerve/jkare-2.png"
              alt="Logo"
              className="h-12 md:h-16"
            />
          </div>
          <div className="relative z-10 ">
            <h1 className=" text-5xl md:text-7xl font-bold text-center">
              Welcome to the Admin Portal
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
