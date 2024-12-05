"use client";
import { useState, useEffect } from "react";

const Customers = ({customers}) => {
  const [searchTerm, setSearchTerm] = useState("");



  // Filter customers by username based on search input
  const filteredCustomers = customers.filter((customer) =>
    customer.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto p-5 bg-gray-100 min-h-screen">
      <h1 className="text-center text-4xl font-bold text-customBlue mb-8 ">
        All Customers
      </h1>
      {/* Search Bar */}
      <div className="mb-4 flex justify-start">
        <input
          type="text"
          placeholder="Search by username"
          className="w-1/2 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-customPink"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Customer Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-6 py-3 text-sm font-medium text-center">S. No.</th>
              <th className="px-6 py-3 text-sm font-medium text-center">Username</th>
              <th className="px-6 py-3 text-sm font-medium text-center">Full Name</th>
              <th className="px-6 py-3 text-sm font-medium text-center">Email</th>
              <th className="px-6 py-3 text-sm font-medium text-center">Phone No</th>
              <th className="px-6 py-3 text-sm font-medium text-center">Total Orders</th>
              <th className="px-6 py-3 text-sm font-medium text-center">Total Sales</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer, index) => (
              <tr
                key={index}
                className="border border-b-gray-300"
              >
                <td className="px-6 py-4 text-sm text-center">{index + 1}</td>
                <td className="px-6 py-4 text-sm text-center">{customer.username}</td>
                <td className="px-6 py-4 text-sm text-center">{customer.fullName}</td>
                <td className="px-6 py-4 text-sm text-center">{customer.email}</td>
                <td className="px-6 py-4 text-sm text-center">{customer.phone}</td>
                <td className="px-6 py-4 text-sm text-center">{customer.totalOrders}</td>
                <td className="px-6 py-4 text-sm text-center">$ {customer.totalSales}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCustomers.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No results found.</p>
        )}
      </div>
    </div>
  );
};

export default Customers;
