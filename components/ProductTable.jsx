"use client";
import { useState } from "react";
import { IoWifiSharp } from "react-icons/io5";
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
    if(term.length > 0)
      url += `?query=${term}`;

    const res = await fetch(url)
    const data = await res.json();
    setProducts(data.products);
  }

  return (
    <div className="bg-gray-100  flex flex-col overflow-hidden">
      {/* Product Table */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 bg-gray-100">
          <div className="max-w-7xl p-8 mx-auto relative bg-white border-2 border-red-500">
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
            <div className="overflow-x-auto max-h-[40vh] relative">
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100 sticky top-0 z-50">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">S No</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Is Featured
                    </th>
                    <th className="border border-gray-300 px-4 py-2">Name</th>
                    <th className="border border-gray-300 px-4 py-2">Image</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Category
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Product ID
                    </th>
                    <th className="border border-gray-300 px-4 py-2">Brand</th>
                    <th className="border border-gray-300 px-4 py-2">Vendor</th>
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
                      <td className="border border-gray-300 px-4 py-2">
                        {index + 1}
                      </td>

                      {/* Is Featured */}

                      <td className="border border-gray-300 px-4 py-2">
                        {product.isFeatured ? (
                          <div className="relative flex justify-center items-center">
                            {/* Pulsating Effect */}
                            <span className="absolute inset-0 rounded-md bg-green-500 opacity-50 animate-ping"></span>
                            {/* Centered Text */}
                            <span className="relative z-10 flex items-center justify-center px-6 py-2 bg-green-600 text-white text-lg font-semibold rounded-md shadow-lg">
                              Live
                              <IoWifiSharp className="w-5 h-5 ml-2" />
                            </span>
                          </div>
                        ) : (
                          <div className="relative flex justify-center items-center">
                            {/* Pulsating Effect */}
                            <span className="absolute inset-0 rounded-md bg-red-500 opacity-50 animate-ping"></span>
                            {/* Centered Text */}
                            <span className="relative z-10 flex items-center justify-center px-6 py-2  bg-red-600 text-white text-lg font-semibold rounded-md shadow-lg">
                              On Board
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Product Name */}
                      <td className="border border-gray-300 px-4 py-2">
                        {product.prod_name}
                      </td>

                      {/* Product Image */}
                      <td className="border border-gray-300 px-4 py-2 relative">
                        <img
                          src={product.prod_images[0]}
                          alt={`Product ${product.prod_id}`}
                          className="w-20 h-20 object-cover"
                        />
                      </td>

                      {/* Category */}
                      <td className="border border-gray-300 px-4 py-2">
                        {product.category}
                      </td>

                      {/* Product ID */}
                      <td className="border border-gray-300 px-4 py-2">
                        {product.prod_id}
                      </td>

                      {/* Brand */}
                      <td className="border border-gray-300 px-4 py-2">
                        {product.brand_name}
                      </td>

                      {/* Vendor */}
                      <td className="border border-gray-300 px-4 py-2">
                        {product.vendor_name}
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
                        className="border border-gray-300 px-4 py-2 truncate relative overflow-visible"
                        onMouseEnter={() =>
                          setHoveredData(product.prod_highlight.join(", "))
                        }
                        onMouseLeave={() => setHoveredData(null)}
                      >
                        {product.prod_highlight[0]}
                        {hoveredData === product.prod_highlight.join(", ") && (
                          <div
                            className="absolute z-50 bg-white border border-gray-300 p-2 shadow-lg max-w-xs whitespace-normal break-words"
                            style={{ top: "-10px" }}
                          >
                            {product.prod_highlight.join(", ")}
                          </div>
                        )}
                      </td>

                      {/* Features with Hover */}
                      <td
                        className="border border-gray-300 px-4 py-2 truncate relative overflow-visible"
                        onMouseEnter={() =>
                          setHoveredData(
                            Object.entries(product.key_features)
                              .map(
                                ([key, value]) =>
                                  `${key}: ${value ? "Yes" : "No"}`
                              )
                              .join(", ")
                          )
                        }
                        onMouseLeave={() => setHoveredData(null)}
                      >
                        {Object.keys(product.key_features)[0]}:{" "}
                        {Object.values(product.key_features)[0] ? "Yes" : "No"}
                        {hoveredData ===
                          Object.entries(product.key_features)
                            .map(
                              ([key, value]) =>
                                `${key}: ${value ? "Yes" : "No"}`
                            )
                            .join(", ") && (
                          <div
                            className="absolute z-50 bg-white border border-gray-300 p-2 shadow-lg max-w-xs whitespace-normal break-words"
                            style={{ top: "-10px" }}
                          >
                            {Object.entries(product.key_features).map(
                              ([key, value]) => (
                                <div key={key}>
                                  {key}: {value ? "Yes" : "No"}
                                </div>
                              )
                            )}
                          </div>
                        )}
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
