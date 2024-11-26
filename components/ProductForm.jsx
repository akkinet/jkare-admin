import React, { useState, useMemo } from "react";
import { AiOutlinePlus } from "react-icons/ai"; // Importing the plus icon

function ProductForm({ brandList, catList, vendorList }) {
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  // brand selection
  const [brands, setBrands] = useState(brandList);
  // Category Selection
  const [categories, setCategories] = useState(catList);
  const [newBrand, setNewBrand] = useState("");

  //product upload
  const [isUploadConfirmModalOpen, setIsUploadConfirmModalOpen] =
    useState(false);
  const [newProduct, setNewProduct] = useState({
    prod_id: "",
    brand_name: "",
    category: "",
    isFeatured: true,
    key_features: {},
    prod_desc: "",
    prod_detailed_desc: [],
    prod_highlight: [],
    prod_images: [],
    prod_name: "",
    prod_value: "",
    stockQuantity: 0,
    vendor_name: "",
    discount: 0,
  });
  const [pair, setPair] = useState({ key: "", value: "" });
  const [pHL, setPHL] = useState("");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [dealerPrice, setDealerPrice] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  //key features
  const options = [
    "pay_over_time",
    "rx_required",
    "light_weight",
    "2_years_warranty",
    "free_shipping",
  ];

  const featuresHandler = (option, val) => {
    setNewProduct({
      ...newProduct,
      key_features: {
        ...newProduct.key_features,
        [option]: val,
      },
    });
  };

  let discount = useMemo(() => {
    if (
      newProduct.prod_value != "" &&
      dealerPrice != "" &&
      Number(newProduct.prod_value) > 0
    ) {
      const discount =
        ((newProduct.prod_value - dealerPrice) / newProduct.prod_value) * 100;
      setNewProduct({
        ...newProduct,
        discount: parseFloat(discount.toFixed(2)),
      });
      return discount.toFixed(2); // Returns discount percentage with two decimal places
    }
    return 0;
  }, [newProduct.prod_value, dealerPrice]);

  const handleInput = (e, setter) => {
    let value;
    if (setter == "prod_value")
      value = parseInt(e.target.value.replace(/[^0-9]/g), ""); // Remove non-numeric input
    setNewProduct({ ...newProduct, [setter]: value });
  };

  const wordCount = useMemo(() => {
    const len = newProduct.prod_desc.trim().split(/\s+/).filter(Boolean).length;
    if (len == 300) setIsDisabled(true);
    else setIsDisabled(false);
    return len;
  }, [newProduct.prod_desc]);

  const handleUploadClick = () => {
    setIsUploadConfirmModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsUploadConfirmModalOpen(false);
  };

  const handleFinalUpload = async () => {
    // Handle the upload logic
    console.log("Final upload logic executed.", newProduct);
    setIsUploadConfirmModalOpen(false);

    const productFeatures = {
      pay_over_time: false,
      rx_required: false,
      light_weight: false,
      "2_years_warranty": false,
      free_shipping: false
    }
    const uploadObj = { ...newProduct }
    uploadObj.key_features = { ...uploadObj.key_features, ...productFeatures }
    if (uploadObj.prod_id == "")
      uploadObj.prod_id = new Date().getTime();
    else
      uploadObj.prod_id = parseInt(newProduct.prod_id)

    const response = await fetch("/api/product", {
      method: "POST",
      body: JSON.stringify(uploadObj),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    setNewProduct({
      prod_id: "",
      brand_name: "",
      category: "",
      isFeatured: true,
      key_features: {},
      prod_desc: "",
      prod_detailed_desc: [],
      prod_highlight: [],
      prod_images: [],
      prod_name: "",
      prod_value: "",
      stockQuantity: 0,
      vendor_name: "",
      discount: 0,
    });
    alert("product uploaded")
    console.log("Upload Response:", result);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => file.size <= 2 * 1024 * 1024); // Limit to 2MB

    const promises = validFiles.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          resolve({
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            filePreview: reader.result,
          });
        };

        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then((results) => {
      setNewProduct((prevState) => ({
        ...prevState,
        prod_images: [...prevState.prod_images, ...results],
      }));
    });
  };

  const handleAddMoreImages = () => {
    document.getElementById("imageUploadInput").click();
  };

  const removeImage = (index) => {
    setNewProduct({
      ...newProduct,
      prod_images: newProduct.prod_images.filter((_, i) => i !== index),
    });
  };

  const addNewHighlightField = () => {
    setNewProduct({
      ...newProduct,
      prod_highlight: [...newProduct.prod_highlight, pHL],
    });
    setPHL("");
  };

  const handleAddMore = () => {
    setNewProduct({
      ...newProduct,
      prod_detailed_desc: [
        ...newProduct.prod_detailed_desc,
        { [pair.key.trim()]: pair.value.trim() },
      ],
    });
    setPair({ key: "", value: "" });
  };

  const handleRemovePair = (index) => {
    const updatedPairs = newProduct.prod_detailed_desc.filter(
      (_, i) => i != index
    );
    setNewProduct({
      ...newProduct,
      prod_detailed_desc: updatedPairs,
    });
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setCategories([...categories, newCategory]);
      setNewCategory("");
      setIsAddCategoryModalOpen(false);
    }
  };

  const handleAddBrand = () => {
    if (newBrand.trim()) {
      const updatedBrands = [...brands, newBrand.trim()];
      setBrands(updatedBrands); // Append the new brand
      setNewBrand("");
      setIsModalOpen(false); // Close the modal
    }
  };

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: name == "prod_id" ? value.trim() : value,
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen  ">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-md shadow  overflow-scroll">
        <h2 className="text-2xl font-semibold mb-6">Add Products</h2>
        <form>
          <div className="grid grid-cols-2 gap-6">
            {/* Left Section */}
            <div>
              {/* Product name */}
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Product Name</label>
                <input
                  type="text"
                  placeholder="Product Name"
                  name="prod_name"
                  maxLength="30"
                  value={newProduct.prod_name}
                  onChange={inputHandler}
                  className="w-full border border-gray-300 rounded px-4 py-2"
                />
                <p className="text-sm text-gray-400">
                  Product Name should not exceed 30 characters
                </p>
              </div>
              {/* Select CAtegory */}
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Category</label>
                <div className="flex items-center">
                  <select
                    className="w-full border border-gray-300 rounded px-4 py-2"
                    value={newProduct.category}
                    onChange={inputHandler}
                    name="category"
                  >
                    <option value="">Select</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="text-sm ml-2 px-4 bg-blue-500 text-white rounded"
                    onClick={() => setIsAddCategoryModalOpen(true)}
                  >
                    Add New Category
                  </button>
                </div>

                {isAddCategoryModalOpen && (
                  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                      <h2 className="text-xl mb-4">Add New Category</h2>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Enter new category"
                      />
                      <div className="flex justify-end">
                        <button
                          className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded"
                          onClick={() => setIsAddCategoryModalOpen(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="px-4 py-2 bg-blue-500 text-white rounded"
                          onClick={handleAddCategory}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* Product ID */}
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Prod Id</label>
                <input
                  type="text"
                  placeholder="Enter Product ID"
                  name="prod_id"
                  value={newProduct.prod_id}
                  onChange={({ target }) => !isNaN(target.value) && setNewProduct({ ...newProduct, prod_id: target.value })}
                  className="w-full border border-gray-300 rounded px-4 py-2"
                />
              </div>

              {/* Brand Name */}
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Brand Name</label>
                <div className="flex items-center">
                  <select
                    name="brand_name"
                    className="w-full border border-gray-300 rounded px-4 py-2"
                    value={newProduct.brand_name} // Bind the selected value
                    onChange={inputHandler} // Update the selected brand
                  >
                    <option value="">Select</option>
                    {brands.map((brand, index) => (
                      <option key={index} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="text-sm ml-2 px-4 bg-blue-500 text-white rounded"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Add New Brand
                  </button>
                </div>

                {isModalOpen && (
                  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                      <h2 className="text-xl mb-4">Add New Brand</h2>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
                        value={newBrand}
                        onChange={(e) => setNewBrand(e.target.value)}
                        placeholder="Enter new brand name"
                      />
                      <div className="flex justify-end">
                        <button
                          className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded"
                          onClick={() => setIsModalOpen(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="px-4 py-2 bg-blue-500 text-white rounded"
                          onClick={handleAddBrand}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Brand Name */}
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Vendor Name</label>
                <div className="flex items-center">
                  <select
                    name="vendor_name"
                    className="w-full border border-gray-300 rounded px-4 py-2"
                    value={newProduct.vendor_name} // Bind the selected value
                    onChange={inputHandler} // Update the selected brand
                  >
                    <option value="">Select</option>
                    {vendorList.map((vendor, index) => (
                      <option key={index} value={vendor}>
                        {vendor}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Key features */}
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Key Features</label>
                <div className="w-full border border-gray-300 rounded px-4 py-2">
                  {/* List of Selected Features */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {Object.entries(newProduct.key_features)
                      .filter((feature) => feature[1])
                      .map((f) => f[0])
                      .map((selectedFeature, index) => (
                        <div
                          key={index}
                          className="bg-customBlue text-white px-2 py-4 rounded flex items-center gap-2"
                        >
                          <span>{selectedFeature}</span>
                          <button
                            type="button"
                            className="text-white bg-customBlue rounded-full w-5 h-5 flex items-center justify-center"
                            onClick={() => featuresHandler(selectedFeature, false)}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                  </div>

                  {/* Feature Checkboxes */}
                  <div className="flex flex-wrap gap-4">
                    {options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`feature-${index}`}
                          checked={!!newProduct.key_features[option]}
                          onChange={(e) => featuresHandler(option, e.target.checked)}
                          className="cursor-pointer"
                        />
                        <label
                          htmlFor={`feature-${index}`}
                          className="cursor-pointer text-gray-600"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>


              {/* Prod Description */}
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">
                  Product Description
                </label>
                <textarea
                  placeholder="Description"
                  name="prod_desc"
                  maxLength="3000" // Allows more characters but limits word count
                  value={newProduct.prod_desc}
                  onChange={inputHandler}
                  className={`w-full border rounded px-4 py-2 ${isDisabled ? "border-red-500" : "border-gray-300"
                    }`}
                  disabled={isDisabled}
                />
                <p className="text-sm text-gray-400">
                  {isDisabled
                    ? "Word limit exceeded! You cannot add more than 300 words."
                    : `Words: ${wordCount}/300`}
                </p>
              </div>

              {/* Product Detailed Description */}
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">
                  Product Detailed Description
                </label>
                <div className="p-6 bg-gray-100">
                  <div className="max-w-7xl mx-auto bg-white p-8 rounded-md shadow">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {newProduct.prod_detailed_desc.length > 0 &&
                        newProduct.prod_detailed_desc.map((dtl, index) => (
                          <React.Fragment key={index}>
                            <div>{Object.keys(dtl)[0]}</div>
                            <div>{Object.values(dtl)[0]}</div>
                            {/* Remove Button */}
                            <div className="col-span-2 text-right">
                              <button
                                type="button"
                                onClick={() => handleRemovePair(index)}
                                className="text-red-500 hover:underline"
                              >
                                Remove
                              </button>
                            </div>
                          </React.Fragment>
                        ))}

                      <div>
                        <label className="block text-gray-600 mb-2">
                          Key Point
                        </label>
                        <textarea
                          placeholder="Enter Key Point"
                          value={pair.key}
                          onChange={(e) =>
                            setPair({ ...pair, key: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded px-4 py-2"
                        />
                      </div>
                      {/* Value Text Area */}
                      <div>
                        <label className="block text-gray-600 mb-2">
                          Feature
                        </label>
                        <textarea
                          placeholder="Enter Feature"
                          value={pair.value}
                          onChange={(e) =>
                            setPair({ ...pair, value: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded px-4 py-2"
                        />
                      </div>
                    </div>
                    {/* Add More Button */}
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={handleAddMore}
                        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Add More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Right Section */}
            <div>
              {/* Product Heighlights */}
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">
                  Product Highlights
                </label>
                <div className="p-6 bg-gray-100 ">
                  <div className="max-w-7xl mx-auto bg-white p-8 rounded-md shadow">
                    {newProduct.prod_highlight.length > 0 && (
                      <ul>
                        {newProduct.prod_highlight.map((hl, index) => (
                          <li key={index}>{hl}</li>
                        ))}
                      </ul>
                    )}
                    <div className="mb-4">
                      <label className="block text-gray-600 mb-2">
                        Highlight
                      </label>
                      <textarea
                        placeholder="Enter highlight"
                        value={pHL}
                        onChange={({ target }) => setPHL(target.value)}
                        className="w-full border border-gray-300 rounded px-4 py-2"
                        rows="2"
                      />
                    </div>

                    {/* Add More Button */}
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={addNewHighlightField}
                        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Add More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Price Details */}
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">
                  Price Details
                </label>
                <div className="flex space-x-4">
                  {/* Actual Price */}
                  <div className="flex-1">
                    <label className="block text-gray-600 mb-2">
                      Actual Price
                    </label>
                    <input
                      type="text" // Use text to completely disable arrows
                      placeholder="Actual Price"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="w-full border border-gray-300 rounded px-4 py-2"
                      value={newProduct.prod_value}
                      onChange={(e) => handleInput(e, "prod_value")}
                      onKeyDown={(e) =>
                        ["e", "E", "+", "-"].includes(e.key) &&
                        e.preventDefault()
                      } // Disable non-numeric input
                    />
                  </div>
                  {/* Dealer Price */}
                  <div className="flex-1">
                    <label className="block text-gray-600 mb-2">
                      Dealer Price
                    </label>
                    <input
                      type="text" // Use text to completely disable arrows
                      placeholder="Dealer Price"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="w-full border border-gray-300 rounded px-4 py-2"
                      value={dealerPrice}
                      onChange={(e) =>
                        !isNaN(e.target.value.trim()) &&
                        setDealerPrice(e.target.value)
                      }
                      onKeyDown={(e) =>
                        ["e", "E", "+", "-"].includes(e.key) &&
                        e.preventDefault()
                      } // Disable non-numeric input
                    />
                  </div>
                </div>
              </div>
              {/* Discount */}
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Discount</label>
                <input
                  type="text"
                  placeholder="Discount in %"
                  className="w-full border border-gray-300 rounded px-4 py-2 bg-gray-100"
                  value={`${discount} %`}
                  readOnly
                />
              </div>

              {/* Product Status */}
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">
                  Product Status
                </label>
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="productStatus"
                      value="live"
                      checked={newProduct.isFeatured}
                      onChange={({ target }) =>
                        setNewProduct({
                          ...newProduct,
                          isFeatured: target.value == "live" ? true : false,
                        })
                      }
                      className="form-radio text-blue-600"
                    />
                    <span className="ml-2">Live</span>
                  </label>
                </div>
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="productStatus"
                      value="suspend"
                      checked={!newProduct.isFeatured}
                      onChange={({ target }) =>
                        setNewProduct({
                          ...newProduct,
                          isFeatured: target.value == "live" ? true : false,
                        })
                      }
                      className="form-radio text-blue-600"
                    />
                    <span className="ml-2">Suspend</span>
                  </label>
                </div>
              </div>

              {/* Product Images */}
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">
                  Product Images
                </label>
                <input
                  type="file"
                  multiple
                  id="imageUploadInput"
                  className="hidden"
                  onChange={handleImageUpload}
                />

                {newProduct.prod_images.length === 0 ? (
                  // Dashed box for uploading images
                  <div
                    className="w-full h-40 border-2 border-dashed border-gray-300 flex flex-col justify-center items-center cursor-pointer"
                    onClick={handleAddMoreImages}
                  >
                    <AiOutlinePlus className="text-gray-400 text-4xl" />
                    <p className="text-sm text-gray-400 mt-2">Upload Images</p>
                  </div>
                ) : (
                  // Display uploaded images
                  <div className="flex flex-wrap gap-4 mt-4">
                    {newProduct.prod_images.map((image, index) => (
                      <div
                        key={index}
                        className="relative w-24 h-24 border rounded overflow-hidden"
                      >
                        <img
                          src={image.filePreview}
                          alt={`Uploaded ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {newProduct.prod_images.length > 0 && (
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={handleAddMoreImages}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Add More Images
                    </button>
                  </div>
                )}

                <p className="text-sm text-gray-400 mt-2">
                  Minimum of 6 images required. Maximum 2MB each.
                </p>
                {newProduct.prod_images.length < 6 && (
                  <p className="text-sm text-red-500 mt-2">
                    You need at least 6 images. Currently{" "}
                    {newProduct.prod_images.length} uploaded.
                  </p>
                )}
              </div>
              {/* Stock quantity */}
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">
                  Stock Quantity
                </label>
                <input
                  type="text" // Use text to prevent browser increment/decrement buttons
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Enter stock quantity"
                  className="w-full border border-gray-300 rounded px-4 py-2"
                  value={
                    newProduct.stockQuantity == 0
                      ? ""
                      : newProduct.stockQuantity
                  }
                  onChange={({ target }) =>
                    !isNaN(target.value.trim()) &&
                    setNewProduct({
                      ...newProduct,
                      stockQuantity:
                        target.value.trim() == ""
                          ? 0
                          : parseInt(target.value.trim()),
                    })
                  }
                  onKeyDown={(e) =>
                    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                  } // Prevent invalid characters
                />
              </div>
            </div>
          </div>
          {/* Upload Product Button and logic is written here  */}
          <div>
            <div className="flex justify-end mt-6">
              <button
                type="button"
                className="px-6 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                onClick={handleUploadClick}
              >
                Upload Product
              </button>
            </div>
            {/* Modal for Upload Product */}
            {isUploadConfirmModalOpen && (
              <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded shadow-lg w-1/3">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Confirm Upload
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Please make sure that every filled information is correct.
                    Once it is uploaded to the database, it's not that easy to
                    manipulate the data of all the fields again. So make sure
                    about this.
                  </p>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                      onClick={handleFinalUpload}
                    >
                      Upload
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;
