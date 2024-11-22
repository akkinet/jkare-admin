import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai"; // Importing the plus icon

function ProductForm() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState(""); // Tracks the selected brand
  // brand selection
  const [brands, setBrands] = useState([
    "3B Medical",
    "Sentec",
    "Fisher & Paykel Healthcare",
    "Percussionaire",
    "LM",
    "P2",
    "Oxygen Concentrator Store",
    "Rhythm",
    "AffloVest",
    "ABM Respiratory Care",
    "Radiometer",
  ]);
  const [newBrand, setNewBrand] = useState("");
  //stock quantity
  const [stockQuantity, setStockQuantity] = useState("");

  //Product images 
  const [images, setImages] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [keyValuePairs, setKeyValuePairs] = useState([{ key: "", value: "" },]);
  const [highlightsList, setHighlightsList] = useState([""]);
  const [actualPrice, setActualPrice] = useState("");
  const [dealerPrice, setDealerPrice] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectOption = (option) => {
    if (!selectedOptions.includes(option)) {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleRemoveOption = (option) => {
    setSelectedOptions(selectedOptions.filter((item) => item !== option));
  };

  const handleChange = (e) => {
    const text = e.target.value;
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

    if (wordCount <= 300) {
      setDescription(text);
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };

  const handleStockInputChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Only allow positive numbers
    setStockQuantity(value);
  };
  //Discount calculation
  const calculateDiscount = () => {
    if (actualPrice && dealerPrice && Number(actualPrice) > 0) {
      const discount = ((actualPrice - dealerPrice) / actualPrice) * 100;
      return discount.toFixed(2); // Returns discount percentage with two decimal places
    }
    return 0;
  };
  const handleInput = (e, setter) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric input
    setter(value);
  };

  // Category Selection
  const [categories, setCategories] = useState([
    "Oxygen Therapy Devices",
    "Pap Devices",
    "Respiratory Devices",
    "Respiratory Monitoring Devices",
    "CPAP Masks",
    "Respiratory Therapy Devices",
    "Oxygen Concentrators",
  ]);

  const wordCount = description.trim().split(/\s+/).filter(Boolean).length;

  //product upload
  const [isUploadConfirmModalOpen, setIsUploadConfirmModalOpen] =
    useState(false);

  const handleUploadClick = () => {
    setIsUploadConfirmModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsUploadConfirmModalOpen(false);
  };

  const handleFinalUpload = () => {
    // Handle the upload logic
    console.log("Final upload logic executed.");
    setIsUploadConfirmModalOpen(false);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => file.size <= 2 * 1024 * 1024); // Limit to 2MB
    const newImages = validFiles.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleAddMoreImages = () => {
    document.getElementById("imageUploadInput").click();
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  //key features
  const options = [
    "pay_over_time",
    "rx_required",
    "light_weight",
    "2_years_warranty",
    "free_shipping",
  ];

  const addNewHighlightField = () => {
    setHighlightsList([...highlightsList, ""]);
  };

  const updateHighlightText = (index, value) => {
    const updatedList = [...highlightsList];
    updatedList[index] = value;
    setHighlightsList(updatedList);
  };

  const removeHighlightField = (index) => {
    const updatedList = highlightsList.filter((_, i) => i !== index);
    setHighlightsList(updatedList);
  };

  // product detailed description
  const handleInputChange = (index, field, value) => {
    const updatedPairs = [...keyValuePairs];
    updatedPairs[index][field] = value;
    setKeyValuePairs(updatedPairs);
  };

  const handleAddMore = () => {
    setKeyValuePairs([...keyValuePairs, { key: "", value: "" }]);
  };

  const handleRemovePair = (index) => {
    const updatedPairs = keyValuePairs.filter((_, i) => i !== index);
    setKeyValuePairs(updatedPairs);
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
      setSelectedBrand(newBrand.trim()); // Set the new brand as selected
      setNewBrand("");
      setIsModalOpen(false); // Close the modal
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen  ">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-md shadow max-h-[80vh] overflow-scroll">
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
                  placeholder="Name"
                  maxLength="30"
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
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
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
                  type="number"
                  placeholder="Enter Product ID"
                  className="w-full border border-gray-300 rounded px-4 py-2"
                  min="0"
                />
              </div>

              {/* Brand Name */}
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Brand Name</label>
                <div className="flex items-center">
                  <select
                    className="w-full border border-gray-300 rounded px-4 py-2"
                    value={selectedBrand} // Bind the selected value
                    onChange={(e) => setSelectedBrand(e.target.value)} // Update the selected brand
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

              {/* Key features */}
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Key Features</label>
                <div
                  className="w-full border border-gray-300 rounded px-4 py-2 relative"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="flex flex-wrap gap-2 ">
                    {selectedOptions.map((option, index) => (
                      <div
                        key={index}
                        className="bg-customBlue text-white px-2 py-1 rounded flex items-center gap-2"
                      >
                        <span>{option}</span>
                        <button
                          type="button"
                          className="text-white bg-customBlue rounded-full w-5 h-5 flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveOption(option);
                          }}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Select features"
                    readOnly
                    className="w-full bg-transparent focus:outline-none"
                  />
                </div>

                {isDropdownOpen && (
                  <div className="absolute z-10 bg-white border border-gray-300 rounded w-[35%] mt-2 max-h-40 overflow-auto">
                    {options.map((option, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelectOption(option)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Prod Description */}
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">
                  Product Description
                </label>
                <textarea
                  placeholder="Description"
                  maxLength="3000" // Allows more characters but limits word count
                  value={description}
                  onChange={handleChange}
                  className={`w-full border rounded px-4 py-2 ${
                    isDisabled ? "border-red-500" : "border-gray-300"
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
                    {keyValuePairs.map((pair, index) => (
                      <div key={index} className="grid grid-cols-2 gap-4 mb-4">
                        {/* Key Text Area */}
                        <div>
                          <label className="block text-gray-600 mb-2">
                            Key Point
                          </label>
                          <textarea
                            placeholder="Enter Key Point"
                            value={pair.key}
                            onChange={(e) =>
                              handleInputChange(index, "key", e.target.value)
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
                              handleInputChange(index, "value", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded px-4 py-2"
                          />
                        </div>
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
                      </div>
                    ))}

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
                    {highlightsList.map((highlight, index) => (
                      <div key={index} className="mb-4">
                        <label className="block text-gray-600 mb-2">
                          Highlight {index + 1}
                        </label>
                        <textarea
                          placeholder="Enter highlight"
                          value={highlight}
                          onChange={(e) =>
                            updateHighlightText(index, e.target.value)
                          }
                          className="w-full border border-gray-300 rounded px-4 py-2"
                          rows="2"
                        />
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeHighlightField(index)}
                            className="text-red-500 hover:underline mt-2"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}

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
                      value={actualPrice}
                      onChange={(e) => handleInput(e, setActualPrice)}
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
                      onChange={(e) => handleInput(e, setDealerPrice)}
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
                  value={`${calculateDiscount()} %`}
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
                      value="onboard"
                      className="form-radio text-blue-600"
                    />
                    <span className="ml-2">On Board</span>
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

                {images.length === 0 ? (
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
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className="relative w-24 h-24 border rounded overflow-hidden"
                      >
                        <img
                          src={image}
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

                {images.length > 0 && (
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
                {images.length < 6 && (
                  <p className="text-sm text-red-500 mt-2">
                    You need at least 6 images. Currently {images.length}{" "}
                    uploaded.
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
                  value={stockQuantity}
                  onChange={handleStockInputChange}
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
