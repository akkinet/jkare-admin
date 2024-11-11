"use client"

import React, { useState } from 'react';
import { FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa';

const vendors = [
  {
    id: 'sd5946',
    contactName: 'Liam',
    vendorName: 'Xova',
    address: '716 Hillcrest Rd. Little Falls, NJ 07424',
    phoneNumber: '+91 2332564874',
    email: 'Xova3425@gmail.com',
    products: ['Product 1', 'Product 2'],
    imageUrl: '/images/liam.png', 
  },
  {
    id: 'sd5947',
    contactName: 'Noah',
    vendorName: 'Veltrix',
    address: '716 Hillcrest Rd. Little Falls, NJ 07424',
    phoneNumber: '+91 2332564874',
    email: 'Veltrix3425@gmail.com',
    products: ['Product 1', 'Product 2'],
    imageUrl: '/images/noah.png',
  },
  {
    id: 'sd5948',
    contactName: 'Oliver',
    vendorName: 'Quantis',
    address: '716 Hillcrest Rd. Little Falls, NJ 07424',
    phoneNumber: '+91 2332564874',
    email: 'Quantis3425@gmail.com',
    products: ['Product 1', 'Product 2'],
    imageUrl: '/images/oliver.png',
  },
  // Add other vendor data in the same format as above
];

const VendorTable = () => {
  const [showDropdown, setShowDropdown] = useState(null);

  const handleDropdown = (index) => {
    setShowDropdown(showDropdown === index ? null : index);
  };

  return (
    <div className="p-4">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-pink-600 text-white">
            <th className="py-2 px-4 border">Vendor Id</th>
            <th className="py-2 px-4 border">Contact Name</th>
            <th className="py-2 px-4 border">Firm Name</th>
            <th className="py-2 px-4 border">Address</th>
            <th className="py-2 px-4 border">Phone Number</th>
            <th className="py-2 px-4 border">Email</th>
            <th className="py-2 px-4 border">Top Products</th>
            <th className="py-2 px-4 border">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor, index) => (
            <tr key={index} className="text-center">
              <td className="py-2 px-2 border">{vendor.id}</td>
              <td className="py-2 px-2 border flex items-center justify-center space-x-2">
                <img
                  src={vendor.imageUrl}
                  alt={vendor.contactName}
                  className="w-8 h-8 rounded-full"
                />
                <span>{vendor.contactName}</span>
              </td>
              <td className="py-2 px-2 border">{vendor.vendorName}</td>
              <td className="py-2 px-2 border">{vendor.address}</td>
              <td className="py-2 px-2 border">{vendor.phoneNumber}</td>
              <td className="py-2 px-2 border">{vendor.email}</td>
              <td className="py-2 px-2 border">
                {vendor.products.map((product, i) => (
                  <button
                    key={i}
                    className="bg-blue-200 px-2 py-1 rounded mr-2 text-xs"
                  >
                    {product}
                  </button>
                ))}
              </td>
              <td className="py-2 px-4 border relative">
                <button
                  className="p-1 text-gray-600 hover:text-gray-800"
                  onClick={() => handleDropdown(index)}
                >
                  <FaEllipsisV />
                </button>
                {showDropdown === index && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md">
                    <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                      <FaEdit className="inline mr-2" /> Edit
                    </button>
                    <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                      <FaTrash className="inline mr-2" /> Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="mt-4 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">
        + Add Vendor
      </button>
    </div>
  );
};

export default VendorTable;
