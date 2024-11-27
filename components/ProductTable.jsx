"use client";
import { useState, useRef } from "react";
import { IoWifiSharp } from "react-icons/io5";
import { CiNoWaitingSign } from "react-icons/ci";
import ProductForm from "./ProductForm";

const ProductTable = ({ data }) => {
  const [products, setProducts] = useState(data.products); // Initialize products
  const [searchTerm, setSearchTerm] = useState(""); // Initialize search term
  const [showForm, setShowForm] = useState(false); // Show/hide form
  const [isEditingStock, setIsEditingStock] = useState(null); // Track which product is being edited
  const [editingProduct, setEditingProduct] = useState(null); // Track which product is being edited
  const [editStockValue, setEditStockValue] = useState(""); // Track current editable stock value

  // Handler for searching products
  const searchHandler = async (query) => {
    const term = isNaN(query) ? query : "";
    setSearchTerm(term);

    let url = `/api/product`;
    if (term.length > 0) url += `?query=${term}`;

    const res = await fetch(url);
    const data = await res.json();

    setProducts(data.products); // Update products based on search
  };
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    // Trigger the file input when the button is clicked
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log(file); // You can handle the file further here
  };

  return (
    <div className="bg-gray-100  flex flex-col overflow-hidden">
      {/* Product Table */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 bg-gray-100">
          <div className="max-w-6xl  mx-auto relative  ">
            <h1 className="text-2xl font-bold  border-b border-black">Product Table <span className="text-lg font-medium">
              (Total Products: {products.length})
            </span></h1>


            {/* Search Bar and Product Count */}
            <div className=" flex justify-between items-center">
              <input
                type="text"
                placeholder="Search by Product Name"
                className="w-1/2 border border-gray-300 rounded px-4 py-2"
                value={searchTerm}
                onChange={(e) => searchHandler(e.target.value)}
              />
              {/* Add Product Button */}
              <div className="py-4  flex justify-start">
                <button
                  className="px-6 py-2 bg-customPink text-white rounded hover:bg-customBlue"
                  onClick={() => setShowForm(!showForm)}
                >
                  Add Product
                </button>
                {/* upload Excel file CSV button  */}
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }} // Hide the file input element
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" // Accept Excel and CSV files
                  />
                  <button
                    className="px-6 py-2 ml-4 bg-green-600 text-white rounded hover:bg-green-800"
                    onClick={handleButtonClick}
                  >
                    Upload Excel File
                  </button>
                </div>
              </div>

            </div>

            {/* Table */}
            <div className="overflow-x-auto max-h-[70vh] relative">
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead className="bg-gray-200 sticky top-0 z-50">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">S No</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Status
                    </th>
                    <th className="border border-gray-300 px-4">Name</th>
                    {/* <th className="border border-gray-300 px-4 py-2">Image</th> */}
                    <th className="border border-gray-300 px-4">
                      Category
                    </th>
                    <th className="border border-gray-300 px-4">
                      Product ID
                    </th>
                    <th className="border border-gray-300 px-4">Vendor</th>
                    <th className="border border-gray-300 px-4">Brand</th>
                    <th className="border border-gray-300 px-4">Stock</th>
                    <th className="border border-gray-300 px-4">Price</th>
                    <th className="border border-gray-300 px-4">
                      Highlights
                    </th>
                    <th className="border border-gray-300 px-4">
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
                            <span className="relative flex items-center justify-center px-2 py-1 bg-green-600 text-white text-lg font-semibold rounded-md shadow-lg">
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
                            <span className="relative flex items-center justify-center px-2 py-1 bg-red-600 text-white text-lg font-semibold rounded-md shadow-lg">
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
                      <td className="border border-gray-300 px-4 py-2 relative group">
                        {isEditingStock === product.id ? (
                          <div className="relative">
                            {/* Floating Edit Box */}
                            <div className="absolute left-full ml-2 bg-white border border-gray-300 shadow-lg rounded-lg p-4 z-10">
                              <h3 className="text-sm font-medium mb-2">
                                Edit Stock for {product.name}
                              </h3>
                              <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={editStockValue || ""}
                                className="w-20 border border-gray-300 rounded px-2 py-1"
                                onChange={(e) => {
                                  const value = e.target.value.trim();
                                  if (!isNaN(value) || value === "") {
                                    setEditStockValue(value); // Update editing value
                                  }
                                }}
                                onKeyDown={(e) =>
                                  ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                                } // Prevent invalid characters
                              />
                              <div className="flex justify-end mt-2 space-x-2">
                                <button
                                  className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400 text-sm"
                                  onClick={() => {
                                    setIsEditingStock(null); // Closing the  box without saving
                                    setEditStockValue(""); // Reset editing value
                                  }}
                                >
                                  Cancel
                                </button>
                                <button
                                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                  onClick={() => {
                                    // Save the updated stock value for this product
                                    setProducts((prevProducts) =>
                                      prevProducts.map((p) =>
                                        p.id === product.id
                                          ? { ...p, stockQuantity: parseInt(editStockValue) || 0 }
                                          : p
                                      )
                                    );
                                    setIsEditingStock(null);
                                    setEditStockValue(""); // Reset editing value
                                  }}
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span>{product.stockQuantity}</span>
                            {/* Pencil Icon */}
                            <button
                              className="text-gray-500"
                              onClick={() => {
                                setIsEditingStock(product.id);
                                setEditStockValue(product.stockQuantity.toString());
                              }}
                            >
                              ✏️
                            </button>
                          </div>
                        )}
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



      {showForm && <ProductForm brandList={data.brands} catList={data.categories} vendorList={data.vendors} />}
    </div>
  );
};

export default ProductTable;
