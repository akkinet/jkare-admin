"use client";
import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const [newUser, setNewUser] = useState({
    email: "",
    name: "",
    phone: "",
    role: "Analyst",
    password: "",
    image: "",
  });


  // Fetch Users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/user");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Search User

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      fetchUsers();
      return;
    }

    try {
      const response = await fetch(`/api/user?email=${query.trim()}`);
      if (response.ok) {
        const data = await response.json();

        if (Array.isArray(data)) {
          setFilteredUsers(data);
        } else if (data) {
          setFilteredUsers([data]);
        } else {
          setFilteredUsers([]);
          alert("No user found with this email.");
        }
      } else {
        setFilteredUsers([]);
        alert("User not found.");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setFilteredUsers([]);
      alert("Error fetching user. Please try again.");
    }
  };

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  // Reset Form
  const resetForm = () => {
    setNewUser({
      email: "",
      name: "",
      phone: "",
      role: "Analyst",
      password: "",
      image: "",
    });
    setEditingIndex(null);
  };

  // Add New User
  const addUser = async (e) => {
    e.preventDefault();

    if (!newUser.email || !newUser.name || !newUser.phone || !newUser.password || !newUser.image) {
      alert("All fields are required!");
      return;
    }

    const userData = {
      email: newUser.email,
      name: newUser.name,
      phone: Number(newUser.phone),
      role: newUser.role,
      password: newUser.password,
      image: newUser.image,
    };

    try {
      const response = await fetch("/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert("User created successfully!");
        fetchUsers();
        setShowModal(false);
        resetForm();
      } else {
        alert("Failed to create user.");
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };


  // Update User
  const updateUser = async (e) => {
    e.preventDefault();

    if (!newUser.email) return;

    const userData = {
      name: newUser.name,
      phone: Number(newUser.phone),
      role: newUser.role,
      password: newUser.password,
      image: newUser.image,
    };

    try {
      const response = await fetch(`/api/user/${newUser.email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert("User updated successfully!");
        fetchUsers();
        setShowModal(false);
        resetForm();
      } else {
        alert("Failed to update user.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };


  // Delete User
  const deleteUser = async () => {
    const userToDelete = users[editingIndex]?.email;
    if (!userToDelete) return;

    try {
      const response = await fetch(`/api/user/${userToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("User deleted successfully!");
        fetchUsers();
      } else {
        alert("Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }

    setShowDeleteModal(false);
    setEditingIndex(null);
  };

  // Open Edit Modal
  const openEditModal = (index) => {
    setEditingIndex(index);
    setNewUser(users[index]);
    setShowModal(true);
  };

  return (
    <div className="p-4 bg-gray-100  h-[89vh]">
      <h1 className="text-center text-4xl font-bold text-customBlue mb-8">User Management</h1>

      <div className="flex justify-between items-center mb-6">
        <div className="flex w-1/2">
          <input
            type="text"
            placeholder="Search by Email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onBlur={() => handleSearch(searchQuery)}
            className="w-full border rounded-lg p-2"
          />
          <button
            className="ml-2 px-4 py-2 bg-customPink text-white rounded-lg hover:bg-customBlue"
            onClick={() => handleSearch(searchQuery)}
          >
            Search
          </button>
        </div>

        <button
          className="ml-4 px-4 py-2 bg-customPink text-white rounded-lg hover:bg-customBlue"
          onClick={() => {
            setShowModal(true);
            resetForm();
          }}
        >
          + Add New User
        </button>
      </div>

      <div className="overflow-x-auto max-h-[28vw] relative">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <thead className="sticky top-0 bg-customPink text-white z-20">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold uppercase border-b border-gray-300">
                S.No.
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold uppercase border-b border-gray-300">
                User ID (Email)
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold uppercase border-b border-gray-300">
                Name
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold uppercase border-b border-gray-300">
                Phone Number
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold uppercase border-b border-gray-300">
                Role
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold uppercase border-b border-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={index} className="hover:bg-gray-100 transition duration-200 ease-in-out">
                  <td className="py-3 px-4 border-b border-gray-200">{index + 1}</td>
                  <td className="py-3 px-4 border-b border-gray-200">{user.email}</td>
                  <td className="py-3 px-4 border-b border-gray-200 flex items-center space-x-2">
                    <img
                      src={user.image}
                      alt={`${user.name}'s profile`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="text-gray-800 font-medium">{user.name}</span>
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200">{user.phone}</td>
                  <td className="py-3 px-4 border-b border-gray-200">{user.role}</td>
                  <td className="py-3 px-4 border-b border-gray-200">
                    <button
                      onClick={() => openEditModal(index)}
                      className="text-blue-600 hover:text-blue-800 transition duration-200 mr-2"
                    >
                      <FaEdit className="inline-block mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => {
                        setEditingIndex(index);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-600 hover:text-red-800 transition duration-200"
                    >
                      <FaTrash className="inline-block mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray-500 font-medium">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>


        </table>
      </div>


      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {editingIndex !== null ? "Edit User" : "Add New User"}
            </h2>
            <form onSubmit={editingIndex !== null ? updateUser : addUser} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">User ID (Email)</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-customPink"
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newUser.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-customPink"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={newUser.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/, "");
                    setNewUser({ ...newUser, phone: value });
                  }}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-customPink"
                />

              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  id="role"
                  name="role"
                  value={newUser.role}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-customPink"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Analyst">Analyst</option>
                  <option value="Billing Specialist">Billing Specialist</option>
                </select>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-customPink"
                />

              </div>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="showPassword"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  className="mr-2"
                />
                <label htmlFor="showPassword" className="text-sm text-gray-700">
                  Show Password
                </label>
              </div>


              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                  Image URL
                </label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={newUser.image}
                  placeholder="Paste image link here"
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-customPink"
                />
              </div>


              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-customPink text-white rounded-lg hover:bg-customBlue"
                >
                  {editingIndex !== null ? "Save Changes" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-red-600">Delete User</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <strong>{users[editingIndex]?.name}</strong>?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-200"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                onClick={deleteUser}
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

export default UserManagement;
