"use client";
import { useState, useEffect } from "react";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch the data from the API
    const fetchCustomers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/customers");
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  // Filter customers by username based on search input
  const filteredCustomers = customers.filter((customer) =>
    customer.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-5 bg-gray-100 min-h-screen">
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
              <th className="px-6 py-3 text-left text-sm font-medium">S. No.</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Username</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Full Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Phone No</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Total Orders</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Total Sales</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer, index) => (
              <tr
                key={index}
                className="border border-b-gray-300"
              >
                <td className="px-6 py-4 text-sm">{index + 1}</td>
                <td className="px-6 py-4 text-sm">{customer.username}</td>
                <td className="px-6 py-4 text-sm">{customer.fullName}</td>
                <td className="px-6 py-4 text-sm">{customer.email}</td>
                <td className="px-6 py-4 text-sm">{customer.phone}</td>
                <td className="px-6 py-4 text-sm">{customer.totalOrders}</td>
                <td className="px-6 py-4 text-sm">$ {customer.totalSales}</td>
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
