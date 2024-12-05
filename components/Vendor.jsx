"use client";
import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

function Vendor({ list }) {
  const [vendors, setVendors] = useState(list);
  const [showDropdown, setShowDropdown] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Add this state
  const [filteredVendors, setFilteredVendors] = useState(list); // Add filteredVendors for search results

  const [newVendor, setNewVendor] = useState({
    id: "",
    contactName: "",
    name: "",
    address: "",
    phoneNumber: "",
    email: "",
    imageUrl: "",
  });

  const handleSearch = (query) => {
    setSearchQuery(query); // Update the search query state
    const lowerQuery = query.toLowerCase();

    // Filter vendors by id or name
    const filtered = vendors.filter(
      (vendor) =>
        vendor.id.toLowerCase().includes(lowerQuery) ||
        vendor.name.toLowerCase().includes(lowerQuery)
    );

    setFilteredVendors(filtered); // Update filtered vendors
  };


  const handleDropdown = (index) => {
    setShowDropdown(showDropdown === index ? null : index);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVendor({ ...newVendor, [name]: value });
  };

  const generateVendorId = () => {
    const prefix = "JK";
    const randomNumber = Math.floor(200 + Math.random() * 900);
    return `${prefix}-${randomNumber}`;
  };
  

  const updateVendor = async () => {
    try {
      // Created a copy of the newVendor object excluding the `id` property
      const { id, ...vendorData } = newVendor;

      const response = await fetch(
        `/api/vendors/${id}`, // Include the id in the URL, not in the body
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(vendorData), // Exclude id from the body
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update vendor: ${response.statusText}`);
      }

      const updatedVendor = await response.json();

      // Update local state
      setVendors((prevVendors) =>
        prevVendors.map((vendor, index) =>
          index === editingIndex ? updatedVendor : vendor
        )
      );

      alert("Vendor updated successfully!");
    } catch (error) {
      alert("Failed to update vendor. Please try again.");
    }
  };


  const deleteVendor = async () => {
    try {
      const response = await fetch(
        `/api/vendors/${vendors[editingIndex].id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete vendor: ${response.statusText}`);
      }

      // Update local state
      setVendors((prevVendors) =>
        prevVendors.filter((_, index) => index !== editingIndex)
      );

      alert("Vendor deleted successfully!");
    } catch (error) {
      // console.error("Error deleting vendor:", error);
      alert("Failed to delete vendor. Please try again.");
    }

    setShowDeleteModal(false);
    setEditingIndex(null);
  };

  const addOrUpdateVendor = async (e) => {
    e.preventDefault();

    const { contactName, name, address, phoneNumber, email } = newVendor;

    if (!contactName || !name || !address || !phoneNumber || !email) {
      alert("Please fill in all the fields before saving the vendor.");
      return;
    }

    if (editingIndex !== null) {
      // Update vendor
      await updateVendor();
    } else {
      // Add new vendor
      try {
        const newVendorWithId = { ...newVendor, id: generateVendorId() };

        const { id, ...vendorData } = newVendorWithId;

        const response = await fetch(`/api/vendors/${id}`, {
          method: "PUT", // Using PUT to add a new vendor
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(vendorData), // Exclude id from the body
        });

        if (!response.ok) {
          throw new Error(`Failed to add vendor: ${response.statusText}`);
        }

        const createdVendor = await response.json();

        // Update local state
        setVendors([...vendors, createdVendor]);

        alert("Vendor added successfully!");
      } catch (error) {
        alert("Failed to add vendor. Please try again.");
      }
    }

    setShowModal(false);
    resetForm();
  };


  const resetForm = () => {
    setNewVendor({
      id: "",
      contactName: "",
      name: "",
      address: "",
      phoneNumber: "",
      email: "",
      imageUrl: "",
    });
    setEditingIndex(null);
  };

  const openEditModal = (index) => {
    setEditingIndex(index);
    setNewVendor(vendors[index]);
    setShowModal(true);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-center text-4xl font-bold text-customBlue mb-8">
        Vendor Management
      </h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by Vendor ID or Name"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)} // Call the search function
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pink-600"
        />

      </div>
      <div className="overflow-x-auto max-h-[28vw] relative">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="sticky top-0 bg-pink-600 text-white z-20">
            <tr className="bg-pink-600 text-white">
              <th className="py-2 px-4 border">Vendor Id</th>
              <th className="py-2 px-4 border">Contact Name</th>
              <th className="py-2 px-4 border">Vendor Name</th>
              <th className="py-2 px-4 border">Address</th>
              <th className="py-2 px-4 border">Phone Number</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredVendors.map((vendor, index) => (
              <tr key={index} className="text-center">
                <td className="py-2 px-2 border">{vendor.id}</td>
                <td className="py-2 px-2 border">{vendor.contactName ?? ""}</td>
                <td className="py-2 px-2 border text-left relative group">
                  {/* Truncated Name */}
                  <div className="truncate max-w-xs cursor-pointer">
                    {vendor.name ?? ""}
                  </div>

                  {/* Tooltip */}
                  {vendor.name && (
                    <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 z-50 w-64 bg-gray-700 text-white text-sm font-medium px-4 py-2 rounded shadow-lg hidden group-hover:block">
                      {vendor.name}
                    </div>
                  )}
                </td>

                <td className="py-2 px-2 border relative group">
                  {/* Truncated Address */}
                  <div className="truncate max-w-xs cursor-pointer">
                    {vendor.address ?? ""}
                  </div>

                  {/* Tooltip */}
                  {vendor.address && (
                    <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 z-50 w-64 bg-gray-700 text-white text-sm font-medium px-4 py-2 rounded shadow-lg hidden group-hover:block">
                      {vendor.address}
                    </div>
                  )}
                </td>

                <td className="py-2 px-2 border">{vendor.phoneNumber ?? ""}</td>
                <td className="py-2 px-2 border">{vendor.email ?? ""}</td>
                <td className="py-2 px-4 border">
                  <button
                    className="p-2 text-blue-600 hover:text-blue-800"
                    onClick={() => openEditModal(index)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="p-2 text-red-600 hover:text-red-800 ml-2"
                    onClick={() => {
                      setEditingIndex(index);
                      setShowDeleteModal(true);
                    }}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>


      <button
        className="mt-4 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition duration-200"
        onClick={() => setShowModal(true)}
      >
        + Add Vendor
      </button>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {editingIndex !== null ? "Edit Vendor" : "Add New Vendor"}
            </h2>
            <form onSubmit={addOrUpdateVendor} className="space-y-4">
              {/* Fields */}
              <div>
                <label htmlFor="contactName">Contact Name</label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  value={newVendor.contactName}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label htmlFor="name">Vendor Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newVendor.name}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={newVendor.address}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={newVendor.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newVendor.email}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
                >
                  {editingIndex !== null ? "Save Changes" : "Create Vendor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Delete Vendor</h2>
            <p>
              Are you sure you want to delete{" "}
              <strong>{vendors[editingIndex]?.contactName}</strong>?
            </p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={deleteVendor}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Vendor;
