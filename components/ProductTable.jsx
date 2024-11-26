"use client";
import { useState } from "react";
import { IoWifiSharp } from "react-icons/io5";
import { CiNoWaitingSign } from "react-icons/ci";
import ProductForm from "./ProductForm";

const ProductTable = ({ data }) => {
  const [products, setProducts] = useState(data.products);
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredData, setHoveredData] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const searchHandler = async (query) => {
    const term = isNaN(query) ? query : '';
    setSearchTerm(term)
    let url = `/api/product`;
    if (term.length > 0)
      url += `?query=${term}`;

    const res = await fetch(url)
    const data = await res.json();

    setProducts(data.products);
  }
  console.log("data", data);

  return (
    <div className="bg-gray-100  flex flex-col overflow-hidden">
      {/* Product Table */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 bg-gray-100">
          <div className="max-w-6xl p-8 mx-auto relative bg-white border-2 border-red-500">
            <h1 className="text-2xl font-bold mb-4">Product Table</h1>

            {/* Search Bar and Product Count */}
            <div className="mb-4 flex justify-between items-center">
              <input
                type="text"
                placeholder="Search by Product Name"
                className="w-3/4 border border-gray-300 rounded px-4 py-2"
                value={searchTerm}
                onChange={(e) => searchHandler(e.target.value)}
              />
              <p className="text-lg font-medium">
                Total Products: {products.length}
              </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto max-h-[50vh] relative">
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100 sticky top-0 z-50">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">S No</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Is Featured
                    </th>
                    <th className="border border-gray-300 px-4 py-2">Name</th>
                    {/* <th className="border border-gray-300 px-4 py-2">Image</th> */}
                    <th className="border border-gray-300 px-4 py-2">
                      Category
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Product ID
                    </th>
                    <th className="border border-gray-300 px-4 py-2">Vendor</th>
                    <th className="border border-gray-300 px-4 py-2">Brand</th>
                    <th className="border border-gray-300 px-4 py-2">Stock</th>
                    <th className="border border-gray-300 px-4 py-2">Price</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Highlights
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Features
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product.prod_id}>
                      {/* Serial Number */}
                      <td className="border border-gray-300 px-4 py-0">
                        {index + 1}
                      </td>

                      {/* Is Featured */}

                      <td className="border border-gray-300 px-2 py-2">
                        {product.isFeatured ? (
                          <div className="relative flex justify-center items-center">
                            {/* Button with Blinking Dot */}
                            <span className="relative flex items-center justify-center px-4 py-2 bg-green-600 text-white text-lg font-semibold rounded-md shadow-lg">
                              Live
                              <IoWifiSharp className="w-5 h-5 ml-2" />
                              {/* Blinking Dot in Top-Right Corner */}
                              <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>
                              </span>
                            </span>
                          </div>
                        ) : (
                          <div className="relative flex justify-center items-center">
                            {/* Button with Blinking Dot */}
                            <span className="relative flex items-center justify-center px-4 py-2 bg-red-600 text-white text-lg font-semibold rounded-md shadow-lg">
                              Hold
                              <CiNoWaitingSign className="w-5 h-5 ml-2" />
                              {/* Blinking Dot in Top-Right Corner */}
                              <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                              </span>
                            </span>
                          </div>
                        )}
                      </td>



                      {/* Product Name */}
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="relative group">
                          {/* Truncated Text */}
                          <span className="block truncate max-w-xs overflow-hidden whitespace-nowrap text-ellipsis">
                            {product.prod_name}
                          </span>
                          {/* Tooltip on Hover */}
                          <div className="absolute left-0 top-full mt-1 hidden w-auto max-w-xs bg-gray-700 text-white text-sm font-medium px-2 py-1 rounded shadow-lg group-hover:block">
                            {product.prod_name}
                          </div>
                        </div>
                      </td>


                      {/* Product Image */}
                      {/* <td className="border border-gray-300 px-4 py-2 relative">
                        <img
                          src={product.prod_images[0]}
                          alt={`Product ${product.prod_id}`}
                          className="w-20 h-20 object-cover"
                        />
                      </td> */}

                      {/* Category */}
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="relative group">
                          {/* Truncated Text */}
                          <span className="block truncate max-w-xs overflow-hidden whitespace-nowrap text-ellipsis">
                            {product.category}
                          </span>
                          {/* Tooltip on Hover */}
                          <div className="absolute left-0 top-full mt-1 hidden w-auto max-w-xs bg-gray-700 text-white text-sm font-medium px-2 py-1 rounded shadow-lg group-hover:block">
                            {product.category}
                          </div>
                        </div>
                      </td>


                      {/* Product ID */}
                      <td className="border border-gray-300 px-4 py-2">
                        {product.prod_id}
                      </td>

                      {/* Vendor */}
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="relative group">
                          {/* Truncated Text */}
                          <span className="block truncate max-w-xs overflow-hidden whitespace-nowrap text-ellipsis">
                            {product.vendor_name}
                          </span>
                          {/* Tooltip on Hover */}
                          <div className="absolute left-0 top-full mt-1 hidden w-auto max-w-xs bg-gray-700 text-white text-sm font-medium px-2 py-1 rounded shadow-lg group-hover:block">
                            {product.vendor_name}
                          </div>
                        </div>
                      </td>

                      {/* Brand */}
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="relative group">
                          {/* Truncated Text */}
                          <span className="block truncate max-w-xs overflow-hidden whitespace-nowrap text-ellipsis">
                            {product.brand_name}
                          </span>
                          {/* Tooltip on Hover */}
                          <div className="absolute left-0 top-full mt-1 hidden w-auto max-w-xs bg-gray-700 text-white text-sm font-medium px-2 py-1 rounded shadow-lg group-hover:block">
                            {product.brand_name}
                          </div>
                        </div>
                      </td>



                      {/* Stock */}
                      <td className="border border-gray-300 px-4 py-2">
                        {product.stockQuantity}
                      </td>

                      {/* Price */}
                      <td className="border border-gray-300 px-4 py-2">
                        ${product.prod_value}
                      </td>

                      {/* Highlights with Hover */}
                      <td
                        className="border border-gray-300 px-4 py-2 relative group"
                      >
                        {/* Truncated Text */}
                        <span className="block truncate max-w-xs overflow-hidden whitespace-nowrap text-ellipsis">
                          {product.prod_highlight[0]}
                        </span>

                        {/* Tooltip on Hover */}
                        <div
                          className="absolute z-50 bg-white border border-gray-300 p-2 shadow-lg max-w-xs whitespace-normal break-words hidden group-hover:block"
                          style={{ top: "100%", left: 0, marginTop: "0.25rem" }}
                        >
                          {product.prod_highlight.join(", ")}
                        </div>
                      </td>


                      {/* Features with Hover */}
                      <td className="border border-gray-300 px-4 py-2 relative group">
                        {/* Truncated Text */}
                        <span className="block truncate max-w-xs overflow-hidden whitespace-nowrap text-ellipsis">
                          {Object.keys(product.key_features)[0]}:{" "}
                          {Object.values(product.key_features)[0] ? "Yes" : "No"}
                        </span>

                        {/* Tooltip on Hover */}
                        <div
                          className="absolute z-50 bg-white border border-gray-300 p-2 shadow-lg max-w-xs whitespace-normal break-words hidden group-hover:block"
                          style={{ top: "100%", left: 0, marginTop: "0.25rem" }}
                        >
                          {Object.entries(product.key_features).map(([key, value]) => (
                            <div key={key}>
                              {key}: {value ? "Yes" : "No"}
                            </div>
                          ))}
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Product Button */}
      <div className="p-4 border-t-2 border-red-500 flex justify-start">
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setShowForm(!showForm)}
        >
          Add Product
        </button>
      </div>

      {showForm && <ProductForm brandList={data.brands} catList={data.categories} vendorList={data.vendors} />}
    </div>
  );
};

export default ProductTable;
