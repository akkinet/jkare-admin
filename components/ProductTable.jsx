"use client";
import { useState, useRef } from "react";
import { IoWifiSharp } from "react-icons/io5";
import { CiNoWaitingSign } from "react-icons/ci";
import ProductForm from "./ProductForm";

const ProductTable = ({ data }) => {
  const [products, setProducts] = useState(data.products); // Initialize products
  const [searchTerm, setSearchTerm] = useState(""); // Initialize search term
  const [showForm, setShowForm] = useState(false); // Show/hide form
  const [isEditingStock, setIsEditingStock] = useState(false); // Track which product is being edited
  const [editStockValue, setEditStockValue] = useState({
    prodID: "",
    name: "",
    quantity: 0,
  }); // Track current editable stock value

  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [editPriceValue, setEditPriceValue] = useState({
    prodID: "",
    name: "",
    price: 0,
  });
  const [isEditingDiscount, setIsEditingDiscount] = useState(false);
  const [editDiscountValue, setEditDiscountValue] = useState({
    prodID: "",
    name: "",
    discount: 0,
  });

  const discountHandler = async () => {
    const body = { ...editDiscountValue };
    delete body.prodID;
    await fetch(`/api/product/${editDiscountValue.prodID}`, {
      method: "PUT",
      body: JSON.stringify({
        discount: body.discount,
      }),
    });
    // Update the discount in the products state
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.prod_id == editDiscountValue.prodID
          ? { ...p, discount: editDiscountValue.discount }
          : p
      )
    );
    setIsEditingDiscount(false);
    setEditDiscountValue({
      prodID: "",
      name: "",
      discount: 0,
    });
  };




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
  const toggleForm = async () => {
    setShowForm(!showForm);
    const res = await fetch(`/api/product`);
    const data = await res.json();

    setProducts(data.products);
  };

  const stockHandler = async () => {
    const body = { ...editStockValue };
    delete body.prodID;
    await fetch(`/api/product/${editStockValue.prodID}`, {
      method: "PUT",
      body: JSON.stringify({
        stockQuantity: body.quantity,
      }),
    });
    // Save the updated stock value for this product
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.prod_id == editStockValue.prodID
          ? { ...p, stockQuantity: editStockValue.quantity }
          : p
      )
    );
    setIsEditingStock(false);
    setEditStockValue({
      prodID: "",
      name: "",
      quantity: 0,
    }); // Reset editing value
  };

  const priceHandler = async () => {
    const body = { ...editPriceValue };
    delete body.prodID;
    await fetch(`/api/product/${editPriceValue.prodID}`, {
      method: "PUT",
      body: JSON.stringify({
        prod_value: body.price,
      }),
    });
    // Save the updated price for this product
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.prod_id == editPriceValue.prodID
          ? { ...p, prod_value: editPriceValue.price }
          : p
      )
    );
    setIsEditingPrice(false);
    setEditPriceValue({
      prodID: "",
      name: "",
      price: 0,
    });
  };


  const statHandler = async (id, bool) => {
    await fetch(`/api/product/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        isFeatured: !bool,
      }),
    });

    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.prod_id == id
          ? { ...p, isFeatured: !bool }
          : p
      )
    );
  }

  return (
    <>
      {showForm ? (
        // Show the product form when showForm is true
        <ProductForm
          brandList={data.brands}
          catList={data.categories}
          vendorList={data.vendors}
          onBack={toggleForm} // This function should toggle the visibility state
        />
      ) : (
        // Show the product table when showForm is false
        <div className="">
          <div className="p-6 bg-gray-100 ">
            <div className="max-w-6xl mx-auto relative">
              <h1 className="text-center text-4xl font-bold text-customBlue ">
                All  Products
              </h1>
              <h1 className="text-2xl font-bold border-b border-black">
                Product Table{" "}
                <span className="text-lg font-medium">
                  (Total Products: {products.length})
                </span>
              </h1>
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
                    Add New Product
                  </button>
                  {/* upload Excel file CSV button  */}
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      style={{ display: "none" }} // Hide the file input element
                      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" // Accept Excel and CSV files
                    />
                    <button
                      className="px-6 py-2 ml-4 bg-green-600 text-white rounded hover:bg-green-800"
                      onClick={handleButtonClick}
                    >
                      Upload Excel File / .csv
                    </button>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto max-h-[30vw] relative">
                <table className="table-auto w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-200 sticky top-0 z-40">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">S No</th>
                      <th className="border border-gray-300 px-4 py-2">
                        Status
                      </th>

                      <th className="border border-gray-300 px-4">Name</th>
                      {/* <th className="border border-gray-300 px-4 py-2">Image</th> */}
                      <th className="border border-gray-300 px-4">Category</th>
                      <th className="border border-gray-300 px-4">
                        Product ID
                      </th>
                      <th className="border border-gray-300 px-4">Vendor</th>
                      <th className="border border-gray-300 px-4">Brand</th>
                      <th className="border border-gray-300 px-4">Stock</th>
                      <th className="border border-gray-300 px-4">SellingPrice</th>
                      <th className="border border-gray-300 px-4">Discount</th>
                      <th className="border border-gray-300 px-4">
                        Highlights
                      </th>
                      <th className="border border-gray-300 px-4">Features</th>
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
                        <td
                          className="border border-gray-300 px-2 py-2 group relative"
                          onClick={() => statHandler(product.prod_id, product.isFeatured)}
                        >
                          {product.isFeatured ? (
                            <div className="relative flex justify-center items-center hover:cursor-pointer">
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

                              {/* Tooltip on Hover */}
                              <div className="absolute left-full  top-1/2 mt-2 z-50 w-64 bg-gray-700 text-white text-sm font-medium px-4 py-2 rounded shadow-lg hidden group-hover:block">
                                Clicking on this button will allow you to enable or disable your product.
                              </div>
                            </div>
                          ) : (
                            <div className="relative flex justify-center items-center hover:cursor-pointer">
                              {/* Button with Blinking Dot */}
                              <span className="relative flex items-center justify-center px-2 py-1 bg-red-600 text-white text-lg font-semibold rounded-md shadow-lg">
                                Suspended
                                <CiNoWaitingSign className="w-5 h-5 ml-2" />
                                {/* Blinking Dot in Top-Right Corner */}
                                <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                                </span>
                              </span>

                              {/* Tooltip on Hover */}
                              <div className="absolute left-full  top-1/2 mt-2 z-50 w-64 bg-gray-700 text-white text-sm font-medium px-4 py-2 rounded shadow-lg hidden group-hover:block">
                                Clicking on this button will allow you to enable or disable your product.
                              </div>
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
                          <div className="flex items-center justify-between">
                            <span>{product.stockQuantity}</span>
                            {/* Pencil Icon */}
                            <button
                              className="text-gray-500"
                              onClick={() => {
                                setIsEditingStock(true);
                                setEditStockValue({
                                  quantity: product.stockQuantity,
                                  name: product.prod_name,
                                  prodID: product.prod_id,
                                });
                              }}
                            >
                              ✏️
                            </button>
                          </div>
                        </td>
                        {/* Price */}
                        <td className="border border-gray-300 px-4 py-2 relative group">
                          <div className="flex items-center justify-between">
                            <span>${product.prod_value}</span>
                            {/* Pencil Icon */}
                            <button
                              className="text-gray-500"
                              onClick={() => {
                                setIsEditingPrice(true);
                                setEditPriceValue({
                                  price: product.prod_value,
                                  name: product.prod_name,
                                  prodID: product.prod_id,
                                });
                              }}
                            >
                              ✏️
                            </button>
                          </div>
                        </td>

                        <td className="border border-gray-300 px-4 py-2 relative group">
                          <div className="flex items-center justify-between">
                            <span>{product.discount ? `${product.discount}%` : "0%"}</span>
                            <button
                              className="text-gray-500"
                              onClick={() => {
                                setIsEditingDiscount(true);
                                setEditDiscountValue({
                                  discount: product.discount || 0,
                                  name: product.prod_name,
                                  prodID: product.prod_id,
                                });
                              }}
                            >
                              ✏️
                            </button>
                          </div>
                        </td>


                        {/* Highlights with Hover */}
                        <td className="border border-gray-300 px-4 py-2 relative group">
                          {/* Truncated Text */}
                          <span className="block truncate max-w-xs overflow-hidden whitespace-nowrap text-ellipsis">
                            {product.prod_highlight[0]}
                          </span>

                          {/* Tooltip on Hover */}
                          <div
                            className="absolute z-50 bg-white border border-gray-300 p-2 shadow-lg max-w-xs whitespace-normal break-words hidden group-hover:block"
                            style={{
                              top: "100%",
                              left: 0,
                              marginTop: "0.25rem",
                            }}
                          >
                            {product.prod_highlight.join(", ")}
                          </div>
                        </td>

                        {/* Features with Hover */}
                        <td className="border border-gray-300 px-4 py-2 relative group">
                          {/* Truncated Text */}
                          <span className="block truncate max-w-xs overflow-hidden whitespace-nowrap text-ellipsis">
                            {Object.keys(product.key_features)[0]}:{" "}
                            {Object.values(product.key_features)[0]
                              ? "Yes"
                              : "No"}
                          </span>

                          {/* Tooltip on Hover */}
                          <div
                            className="absolute z-50 bg-white border border-gray-300 p-2 shadow-lg max-w-xs whitespace-normal break-words hidden group-hover:block"
                            style={{
                              top: "100%",
                              left: 0,
                              marginTop: "0.25rem",
                            }}
                          >
                            {Object.entries(product.key_features).map(
                              ([key, value]) => (
                                <div key={key}>
                                  {key}: {value ? "Yes" : "No"}
                                </div>
                              )
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {isEditingStock && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
              <div className="bg-white w-80 p-6 rounded-lg shadow-lg transform transition-all duration-300 scale-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Stock Update: {editStockValue.name}
                </h3>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={
                    editStockValue.quantity === 0 ? "" : editStockValue.quantity
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter new stock quantity"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      // Allow only numeric input (digits or empty string)
                      setEditStockValue({
                        ...editStockValue, // Ensure previous values are preserved
                        quantity: value === "" ? 0 : parseInt(value, 10),
                      });
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // Prevent default Enter behavior
                      stockHandler(); // Call the save handler
                    }
                    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
                  }} // Prevent invalid characters
                />
                <div className="flex justify-end mt-4 space-x-3">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 text-sm font-medium text-gray-700 transition-colors duration-200"
                    onClick={() => {
                      setIsEditingStock(false); // Close the dialog without saving
                      setEditStockValue({ prodID: "", name: "", quantity: 0 }); // Reset editing value
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium transition-transform duration-200 transform hover:scale-105"
                    onClick={stockHandler}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
          {isEditingPrice && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
              <div className="bg-white w-80 p-6 rounded-lg shadow-lg transform transition-all duration-300 scale-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Price Update: {editPriceValue.name}
                </h3>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={editPriceValue.price === 0 ? "" : editPriceValue.price}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter new price"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d{0,2}$/.test(value)) {
                      // Allow numeric input with up to two decimal places
                      setEditPriceValue({
                        ...editPriceValue,
                        price: value === "" ? 0 : parseFloat(value),
                      });
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      priceHandler(); // Call the save handler
                    }
                    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
                  }} // Prevent invalid characters
                />
                <div className="flex justify-end mt-4 space-x-3">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 text-sm font-medium text-gray-700 transition-colors duration-200"
                    onClick={() => {
                      setIsEditingPrice(false);
                      setEditPriceValue({ prodID: "", name: "", price: 0 });
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium transition-transform duration-200 transform hover:scale-105"
                    onClick={priceHandler}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
          {isEditingDiscount && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
              <div className="bg-white w-80 p-6 rounded-lg shadow-lg transform transition-all duration-300 scale-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Discount Update: {editDiscountValue.name}
                </h3>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={
                    editDiscountValue.discount === 0 ? "" : editDiscountValue.discount
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter new discount"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      // Allow only numeric input (digits or empty string)
                      setEditDiscountValue({
                        ...editDiscountValue,
                        discount: value === "" ? 0 : parseInt(value, 10),
                      });
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      discountHandler(); // Call the save handler
                    }
                    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
                  }}
                />
                <div className="flex justify-end mt-4 space-x-3">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 text-sm font-medium text-gray-700 transition-colors duration-200"
                    onClick={() => {
                      setIsEditingDiscount(false);
                      setEditDiscountValue({ prodID: "", name: "", discount: 0 });
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium transition-transform duration-200 transform hover:scale-105"
                    onClick={discountHandler}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}


        </div>
      )}
    </>
  );
};

export default ProductTable;
