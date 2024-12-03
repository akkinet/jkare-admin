"use client";
import { useState } from "react";
import { FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa";

function Vendor({ list }) {
  const [vendors, setVendors] = useState(list);
  const [showDropdown, setShowDropdown] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newVendor, setNewVendor] = useState({
    id: "",
    contactName: "",
    name: "",
    address: "",
    phoneNumber: "",
    email: "",
    imageUrl: "",
  });

  const updateVendor = async (updatedVendor) => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/vendors/${updatedVendor.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedVendor),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update vendor: ${response.statusText}`);
      }

      const updatedData = await response.json();

      // Update the local state with the response data
      setVendors((prevVendors) =>
        prevVendors.map((vendor) =>
          vendor.id === updatedVendor.id ? updatedData : vendor
        )
      );
      alert("Vendor updated successfully!");
    } catch (error) {
      console.error("Error updating vendor:", error);
      alert("Failed to update vendor.");
    }
  };

  const handleDropdown = (index) => {
    setShowDropdown(showDropdown === index ? null : index);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVendor({ ...newVendor, [name]: value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewVendor({ ...newVendor, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const generateVendorId = () => {
    return Math.random().toString(36).substr(2, 8);
  };
  const addVendor = () => {
    const { contactName, name, address, phoneNumber, email, imageUrl } =
      newVendor;
    if (
      !contactName ||
      !name ||
      !address ||
      !phoneNumber ||
      !email ||
      !imageUrl
    ) {
      alert("Please fill in all the fields before creating a vendor.");
      return;
    }

    if (editingIndex !== null) {
      updateVendor(newVendor); // Call the update function to sync changes to the server
    } else {
      const newVendorWithId = { ...newVendor, id: generateVendorId() };
      setVendors([...vendors, newVendorWithId]);
    }

    setShowModal(false);
    resetForm();
  };

  const deleteVendor = () => {
    const updatedVendors = vendors.filter((_, index) => index !== editingIndex);
    setVendors(updatedVendors);
    setShowDeleteModal(false);
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
    <div className="p-4">
      <h1 className="text-center text-4xl font-bold text-customBlue mb-8">
        Vendor Management
      </h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
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
          {vendors.map((vendor, index) => (
            <tr key={index} className="text-center">
              <td className="py-2 px-2 border">{vendor.id}</td>
              <td className="py-2 px-2 border flex items-center justify-center space-x-2">
                {vendor.image && (
                  <img
                    src="https://media.licdn.com/dms/image/v2/C4D03AQEeEyYzNtDq7g/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1524234561685?e=2147483647&v=beta&t=uHzeaBv3V2z6Tp6wvhzGABlTs9HR-SP-tEX1UbYNn4Q"
                    alt={vendor.contactName}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span>{vendor.contactName ?? ""}</span>
              </td>
              <td className="py-2 px-2 border">{vendor.name ?? ""}</td>
              <td className="py-2 px-2 border">{vendor.address ?? ""}</td>
              <td className="py-2 px-2 border">{vendor.phoneNumber ?? ""}</td>
              <td className="py-2 px-2 border">{vendor.email ?? ""}</td>
              <td className="py-2 px-4 border relative">
                <button
                  className="p-1 text-gray-600 hover:text-gray-800"
                  onClick={() => handleDropdown(index)}
                >
                  <FaEllipsisV />
                </button>
                {showDropdown === index && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md z-10">
                    <button
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                      onClick={() => openEditModal(index)}
                    >
                      <FaEdit className="inline mr-2" /> Edit
                    </button>
                    <button
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                      onClick={() => {
                        setEditingIndex(index);
                        setShowDeleteModal(true);
                      }}
                    >
                      <FaTrash className="inline mr-2" /> Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="mt-4 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
        onClick={() => setShowModal(true)}
      >
        + Add Vendor
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {editingIndex !== null ? "Edit Vendor" : "Add New Vendor"}
            </h2>
            <form onSubmit={addVendor} className="space-y-4">
              {/* Contact Name Field */}
              <div>
                <label
                  htmlFor="contactName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contact Name
                </label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  placeholder="Enter Contact Name"
                  className="w-full border px-3 py-2 rounded mt-1"
                  value={newVendor.contactName ?? ""}
                  onChange={handleInputChange}
                />
              </div>

              {/* Vendor Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Vendor Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter Vendor Name"
                  className="w-full border px-3 py-2 rounded mt-1"
                  value={newVendor.name ?? ""}
                  onChange={handleInputChange}
                />
              </div>

              {/* Address Field */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Enter Address"
                  className="w-full border px-3 py-2 rounded mt-1"
                  value={newVendor.address ?? ""}
                  onChange={handleInputChange}
                />
              </div>

              {/* Phone Number Field */}
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  type="number"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Enter Phone Number"
                  className="w-full border px-3 py-2 rounded mt-1"
                  value={newVendor.phoneNumber ?? ""}
                  onChange={handleInputChange}
                />
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter Email"
                  className="w-full border px-3 py-2 rounded mt-1"
                  value={newVendor.email ?? ""}
                  onChange={handleInputChange}
                />
              </div>

              {/* Photo Upload Field */}
              {/* <div>
                <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700">
                  Upload Photo
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  className="w-full border px-3 py-2 rounded mt-1"
                  onChange={handlePhotoUpload}
                />
              </div> */}

              {/* Action Buttons */}
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
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

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Delete Vendor</h2>
            <p>
              Before Deleting the vendor make sure that the related products of
              the vendor also get's deleted from the database
              <span className="font-bold">
                {vendors[editingIndex]?.contactName}
              </span>
              ?
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
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
