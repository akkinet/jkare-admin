"use client";
import { useState, useRef, useMemo } from "react";
import { IoWifiSharp } from "react-icons/io5";
import { CiNoWaitingSign } from "react-icons/ci";
import ProductForm from "./ProductForm";

const ProductTable = ({ data }) => {
  // 1) Keep all products in a separate state (unfiltered data)
  const [allProducts, setAllProducts] = useState(data.products);

  // 2) Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  // 3) Dropdown toggles
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showVendorDropdown, setShowVendorDropdown] = useState(false);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);

  // 4) Show/hide the "Add New Product" form
  const [showForm, setShowForm] = useState(false);

  // 5) For editing stock, price, discount
  const [isEditingStock, setIsEditingStock] = useState(false);
  const [editStockValue, setEditStockValue] = useState({
    prodID: "",
    name: "",
    quantity: 0,
  });

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

  // 6) For file input (CSV/Excel)
  const fileInputRef = useRef(null);

  // ==========================================================================
  // LOCAL FILTERING
  // ==========================================================================
  /**
   * We derive a filtered list of products based on:
   * - searchTerm
   * - selectedCategory
   * - selectedVendor
   * - selectedBrand
   */
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Match Name (searchTerm)
      if (
        searchTerm &&
        !product.prod_name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Match Category
      if (selectedCategory && product.category !== selectedCategory) {
        return false;
      }

      // Match Vendor
      if (selectedVendor && product.vendor_name !== selectedVendor) {
        return false;
      }

      // Match Brand
      if (selectedBrand && product.brand_name !== selectedBrand) {
        return false;
      }

      return true;
    });
  }, [allProducts, searchTerm, selectedCategory, selectedVendor, selectedBrand]);

  // ==========================================================================
  // Event Handlers
  // ==========================================================================

  // SEARCH: when user types in the search bar
  const handleSearch = (val) => {
    setSearchTerm(val);
  };

  // CATEGORY: invoked when the user picks a category from the dropdown
  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setShowCategoryDropdown(false);
  };

  // VENDOR: invoked when the user picks a vendor from the dropdown
  const handleVendorSelect = (vendor) => {
    setSelectedVendor(vendor);
    setShowVendorDropdown(false);
  };

  // BRAND: invoked when the user picks a brand from the dropdown
  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
    setShowBrandDropdown(false);
  };

  // CLEAR FILTER: resets all filters and search
  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedVendor("");
    setSelectedBrand("");
    setShowCategoryDropdown(false);
    setShowVendorDropdown(false);
    setShowBrandDropdown(false);
  };

  // Show/hide the Product Form, then refresh products from server
  const toggleForm = async () => {
    setShowForm(!showForm);
    // After closing the form, re-fetch products to get newly added product
    if (showForm) {
      // If we just closed the form, fetch fresh data
      const res = await fetch(`/api/product`);
      const freshData = await res.json();
      setAllProducts(freshData.products);
    }
  };

  // UPLOAD FILE: handle .csv or Excel file
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log("Selected file:", file);
    // ... handle file upload here
  };

  // ==========================================================================
  // Updating product fields (Stock, Price, Discount, isFeatured)
  // ==========================================================================

  // Update discount
  const discountHandler = async () => {
    // Update on the server
    await fetch(`/api/product/${editDiscountValue.prodID}`, {
      method: "PUT",
      body: JSON.stringify({ discount: editDiscountValue.discount }),
    });

    // Update locally
    setAllProducts((prev) =>
      prev.map((p) =>
        p._id === editDiscountValue.prodID
          ? { ...p, discount: editDiscountValue.discount }
          : p
      )
    );

    setIsEditingDiscount(false);
    setEditDiscountValue({ prodID: "", name: "", discount: 0 });
  };

  // Update stock
  const stockHandler = async () => {
    await fetch(`/api/product/${editStockValue.prodID}`, {
      method: "PUT",
      body: JSON.stringify({ stockQuantity: editStockValue.quantity }),
    });

    setAllProducts((prev) =>
      prev.map((p) =>
        p._id === editStockValue.prodID
          ? { ...p, stockQuantity: editStockValue.quantity }
          : p
      )
    );

    setIsEditingStock(false);
    setEditStockValue({ prodID: "", name: "", quantity: 0 });
  };

  // Update price
  const priceHandler = async () => {
    await fetch(`/api/product/${editPriceValue.prodID}`, {
      method: "PUT",
      body: JSON.stringify({ prod_value: editPriceValue.price }),
    });

    setAllProducts((prev) =>
      prev.map((p) =>
        p._id === editPriceValue.prodID
          ? { ...p, prod_value: editPriceValue.price }
          : p
      )
    );

    setIsEditingPrice(false);
    setEditPriceValue({ prodID: "", name: "", price: 0 });
  };

  // Toggle isFeatured
  const statHandler = async (id, currentVal) => {
    await fetch(`/api/product/${id}`, {
      method: "PUT",
      body: JSON.stringify({ isFeatured: !currentVal }),
    });

    setAllProducts((prev) =>
      prev.map((p) =>
        p._id === id ? { ...p, isFeatured: !currentVal } : p
      )
    );
  };

  // ==========================================================================
  // JSX
  // ==========================================================================
  return (
    <>
      {showForm ? (
        // Show the product form when showForm is true
        <ProductForm
          brandList={data.brands}
          catList={data.categories}
          vendorList={data.vendors}
          onBack={toggleForm}
        />
      ) : (
        // Show the table and filters when showForm is false
        <>
          <h1 className="text-center text-4xl font-bold text-customBlue">
            All Products
          </h1>

          {/* Search bar, product count, add product, upload CSV */}
          <div className="flex justify-between items-center">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search by Product Name"
              className="w-1/2 border border-gray-300 rounded px-4 py-2"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />

            {/* Display the length of filtered products */}
            <span className="text-lg font-medium">
              Total Products: {filteredProducts.length}
            </span>

            {/* Buttons */}
            <div className="py-4 flex justify-start items-center">
              <button
                className="px-6 py-2 bg-customPink text-white rounded hover:bg-customBlue"
                onClick={() => setShowForm(true)}
              >
                Add New Product
              </button>

              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                />
                <button
                  className="px-6 py-2 ml-4 bg-green-600 text-white rounded hover:bg-green-800"
                  onClick={handleButtonClick}
                >
                  Upload Excel / CSV
                </button>
              </div>
            </div>
          </div>

          {/* FILTER BAR (Clear Filter) */}
          <div className="my-2 flex items-center space-x-4">
            <button
              className="px-4 py-2 bg-gray-200 rounded shadow hover:bg-gray-300 text-sm"
              onClick={clearAllFilters}
            >
              Clear All Filters
            </button>

            {/* Show Currently Selected Filters (optional) */}
            {selectedCategory && (
              <span className="px-2 py-1 bg-blue-50 border text-blue-700 rounded text-sm">
                Category: {selectedCategory}
              </span>
            )}
            {selectedVendor && (
              <span className="px-2 py-1 bg-blue-50 border text-blue-700 rounded text-sm">
                Vendor: {selectedVendor}
              </span>
            )}
            {selectedBrand && (
              <span className="px-2 py-1 bg-blue-50 border text-blue-700 rounded text-sm">
                Brand: {selectedBrand}
              </span>
            )}
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto h-[70vh]">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead className="bg-gray-200 sticky top-0 z-40">
                <tr>
                  <th className="border border-gray-300 px-4 py-2">S No</th>
                  <th className="border border-gray-300 px-4">Product ID</th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                  <th className="border border-gray-300 px-4">Name</th>

                  {/* CATEGORY Header + Filter Icon */}
                  <th className="border border-gray-300 px-4 relative">
                    Category
                    <button
                      className="ml-2 text-sm"
                      onClick={() =>
                        setShowCategoryDropdown(!showCategoryDropdown)
                      }
                    >
                      ▼
                    </button>
                    {showCategoryDropdown && (
                      <div
                        className="absolute bg-white border shadow-lg mt-2 py-2 w-40 z-50"
                        style={{ left: "50%", transform: "translateX(-50%)" }}
                      >
                        {data.categories.map((cat) => (
                          <div
                            key={cat}
                            className="px-4 py-1 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleCategorySelect(cat)}
                          >
                            {cat}
                          </div>
                        ))}
                      </div>
                    )}
                  </th>

                  

                  {/* VENDOR Header + Filter Icon */}
                  <th className="border border-gray-300 px-4 relative">
                    Vendor
                    <button
                      className="ml-2 text-sm"
                      onClick={() => setShowVendorDropdown(!showVendorDropdown)}
                    >
                      ▼
                    </button>
                    {showVendorDropdown && (
                      <div
                        className="absolute bg-white border shadow-lg mt-2 py-2 w-40 z-50"
                        style={{ left: "50%", transform: "translateX(-50%)" }}
                      >
                        {data.vendors.map((vendor) => (
                          <div
                            key={vendor}
                            className="px-4 py-1 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleVendorSelect(vendor)}
                          >
                            {vendor}
                          </div>
                        ))}
                      </div>
                    )}
                  </th>

                  {/* BRAND Header + Filter Icon */}
                  <th className="border border-gray-300 px-4 relative">
                    Brand
                    <button
                      className="ml-2 text-sm"
                      onClick={() => setShowBrandDropdown(!showBrandDropdown)}
                    >
                      ▼
                    </button>
                    {showBrandDropdown && (
                      <div
                        className="absolute bg-white border shadow-lg mt-2 py-2 w-40 z-50"
                        style={{ left: "50%", transform: "translateX(-50%)" }}
                      >
                        {data.brands.map((brand) => (
                          <div
                            key={brand}
                            className="px-4 py-1 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleBrandSelect(brand)}
                          >
                            {brand}
                          </div>
                        ))}
                      </div>
                    )}
                  </th>

                  <th className="border border-gray-300 px-4">Stock</th>
                  <th className="border border-gray-300 px-4">Price</th>
                  <th className="border border-gray-300 px-4">Discount</th>
                  <th className="border border-gray-300 px-4">Highlights</th>
                  <th className="border border-gray-300 px-4">Features</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <tr key={product._id}>
                    {/* Serial Number */}
                    <td className="border border-gray-300 px-4 py-2">
                      {index + 1}
                    </td>
                    {/* Product ID */}
                    <td className="border border-gray-300 px-4 py-2">
                      {product.prod_id}
                    </td>

                    {/* isFeatured Status */}
                    <td
                      className="border border-gray-300 px-2 py-2 group relative"
                      onClick={() =>
                        statHandler(product._id, product.isFeatured)
                      }
                    >
                      {product.isFeatured ? (
                        <div className="relative flex justify-center items-center hover:cursor-pointer">
                          <span className="relative flex items-center justify-center px-2 py-1 bg-green-600 text-white text-lg font-semibold rounded-md shadow-lg">
                            Live
                            <IoWifiSharp className="w-5 h-5 ml-2" />
                            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>
                            </span>
                          </span>
                          {/* Tooltip */}
                          <div className="absolute left-full top-1/2 mt-2 z-50 w-64 bg-gray-700 text-white text-sm font-medium px-4 py-2 rounded shadow-lg hidden group-hover:block">
                            Clicking on this button will enable/disable the product.
                          </div>
                        </div>
                      ) : (
                        <div className="relative flex justify-center items-center hover:cursor-pointer">
                          <span className="relative flex items-center justify-center px-2 py-1 bg-red-600 text-white text-lg font-semibold rounded-md shadow-lg">
                            Suspended
                            <CiNoWaitingSign className="w-5 h-5 ml-2" />
                            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                            </span>
                          </span>
                          {/* Tooltip */}
                          <div className="absolute left-full top-1/2 mt-2 z-50 w-64 bg-gray-700 text-white text-sm font-medium px-4 py-2 rounded shadow-lg hidden group-hover:block">
                            Clicking on this button will enable/disable the product.
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Product Name */}
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="relative group">
                        <span className="block truncate max-w-xs overflow-hidden whitespace-nowrap text-ellipsis">
                          {product.prod_name}
                        </span>
                        <div className="absolute left-0 top-full mt-1 hidden w-auto max-w-xs bg-gray-700 text-white text-sm font-medium px-2 py-1 rounded shadow-lg group-hover:block">
                          {product.prod_name}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="relative group">
                        <span className="block truncate max-w-xs">
                          {product.category}
                        </span>
                        <div className="absolute left-0 top-full mt-1 hidden w-auto max-w-xs bg-gray-700 text-white text-sm font-medium px-2 py-1 rounded shadow-lg group-hover:block">
                          {product.category}
                        </div>
                      </div>
                    </td>

                    

                    {/* Vendor */}
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="relative group">
                        <span className="block truncate max-w-xs">
                          {product.vendor_name}
                        </span>
                        <div className="absolute left-0 top-full mt-1 hidden w-auto max-w-xs bg-gray-700 text-white text-sm font-medium px-2 py-1 rounded shadow-lg group-hover:block">
                          {product.vendor_name}
                        </div>
                      </div>
                    </td>

                    {/* Brand */}
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="relative group">
                        <span className="block truncate max-w-xs">
                          {product.brand_name}
                        </span>
                        <div className="absolute left-0 top-full mt-1 hidden w-auto max-w-xs bg-gray-700 text-white text-sm font-medium px-2 py-1 rounded shadow-lg group-hover:block">
                          {product.brand_name}
                        </div>
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="border border-gray-300 px-4 py-2 relative group">
                      <div className="flex items-center justify-between">
                        <span>{product.stockQuantity}</span>
                        <button
                          className="text-gray-500"
                          onClick={() => {
                            setIsEditingStock(true);
                            setEditStockValue({
                              quantity: product.stockQuantity,
                              name: product.prod_name,
                              prodID: product._id,
                            });
                          }}
                        >
                          ✏️
                        </button>
                      </div>
                    </td>

                    {/* Selling Price */}
                    <td className="border border-gray-300 px-4 py-2 relative group">
                      <div className="flex items-center justify-between">
                        <span>${product.prod_value}</span>
                        <button
                          className="text-gray-500"
                          onClick={() => {
                            setIsEditingPrice(true);
                            setEditPriceValue({
                              price: product.prod_value,
                              name: product.prod_name,
                              prodID: product._id,
                            });
                          }}
                        >
                          ✏️
                        </button>
                      </div>
                    </td>

                    {/* Discount */}
                    <td className="border border-gray-300 px-4 py-2 relative group">
                      <div className="flex items-center justify-between">
                        <span>
                          {product.discount ? `${product.discount}%` : "0%"}
                        </span>
                        <button
                          className="text-gray-500"
                          onClick={() => {
                            setIsEditingDiscount(true);
                            setEditDiscountValue({
                              discount: product.discount || 0,
                              name: product.prod_name,
                              prodID: product._id,
                            });
                          }}
                        >
                          ✏️
                        </button>
                      </div>
                    </td>

                    {/* Highlights */}
                    <td className="border border-gray-300 px-4 py-2 relative group">
                      <span className="block truncate max-w-xs whitespace-nowrap">
                        {product.prod_highlight[0]}
                      </span>
                      <div
                        className="absolute z-50 bg-white border border-gray-300 p-2 shadow-lg max-w-xs whitespace-normal break-words hidden group-hover:block"
                        style={{ top: "100%", left: 0, marginTop: "0.25rem" }}
                      >
                        {product.prod_highlight.join(", ")}
                      </div>
                    </td>

                    {/* Features */}
                    <td className="border border-gray-300 px-4 py-2 relative group">
                      <span className="block truncate max-w-xs whitespace-nowrap">
                        {Object.keys(product.key_features)[0]}:{" "}
                        {Object.values(product.key_features)[0] ? "Yes" : "No"}
                      </span>
                      <div
                        className="absolute z-50 bg-white border border-gray-300 p-2 shadow-lg max-w-xs whitespace-normal break-words hidden group-hover:block"
                        style={{ top: "100%", left: 0, marginTop: "0.25rem" }}
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

          {/* EDITING POPUPS */}

          {/* Edit Stock */}
          {isEditingStock && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
              <div className="bg-white w-80 p-6 rounded-lg shadow-lg">
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                  placeholder="Enter new stock quantity"
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*$/.test(val)) {
                      setEditStockValue({
                        ...editStockValue,
                        quantity: val === "" ? 0 : parseInt(val, 10),
                      });
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      stockHandler();
                    }
                    ["e", "E", "+", "-"].includes(e.key) &&
                      e.preventDefault();
                  }}
                />
                <div className="flex justify-end mt-4 space-x-3">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 text-sm font-medium text-gray-700"
                    onClick={() => {
                      setIsEditingStock(false);
                      setEditStockValue({
                        prodID: "",
                        name: "",
                        quantity: 0,
                      });
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium"
                    onClick={stockHandler}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Price */}
          {isEditingPrice && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
              <div className="bg-white w-80 p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Price Update: {editPriceValue.name}
                </h3>
                <input
                  type="text"
                  inputMode="decimal"
                  pattern="^\d+(\.\d{1,2})?$"
                  value={editPriceValue.price === 0 ? "" : editPriceValue.price}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                  placeholder="Enter new price"
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*\.?\d{0,2}$/.test(val)) {
                      setEditPriceValue({
                        ...editPriceValue,
                        price: val === "" ? 0 : parseFloat(val),
                      });
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      priceHandler();
                    }
                    ["e", "E", "+", "-"].includes(e.key) &&
                      e.preventDefault();
                  }}
                />
                <div className="flex justify-end mt-4 space-x-3">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 text-sm font-medium text-gray-700"
                    onClick={() => {
                      setIsEditingPrice(false);
                      setEditPriceValue({
                        prodID: "",
                        name: "",
                        price: 0,
                      });
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium"
                    onClick={priceHandler}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Discount */}
          {isEditingDiscount && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
              <div className="bg-white w-80 p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Discount Update: {editDiscountValue.name}
                </h3>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={
                    editDiscountValue.discount === 0
                      ? ""
                      : editDiscountValue.discount
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                  placeholder="Enter new discount"
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*$/.test(val)) {
                      setEditDiscountValue({
                        ...editDiscountValue,
                        discount: val === "" ? 0 : parseInt(val, 10),
                      });
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      discountHandler();
                    }
                    ["e", "E", "+", "-"].includes(e.key) &&
                      e.preventDefault();
                  }}
                />
                <div className="flex justify-end mt-4 space-x-3">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 text-sm font-medium text-gray-700"
                    onClick={() => {
                      setIsEditingDiscount(false);
                      setEditDiscountValue({
                        prodID: "",
                        name: "",
                        discount: 0,
                      });
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium"
                    onClick={discountHandler}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ProductTable;
