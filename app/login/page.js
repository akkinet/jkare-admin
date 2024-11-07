"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";

function page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const submitHandler = async (e) => {
    try{
      e.preventDefault();
      await signIn("credentials", {
        email,
        password,
      });
    }catch(err){
      console.log("err", err);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
          Login
        </h2>
        <form onSubmit={submitHandler} method="POST">
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-600 font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-600 font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-medium py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default page;
