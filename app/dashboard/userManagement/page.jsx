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

  useEffect(() => {
    async function fetchApi() {
      const response = await fetch('/api/user');
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    }

    fetchApi();
  }, []);

  const [newUser, setNewUser] = useState({
    email: "",
    name: "",
    phone: "",
    role: "Analyst",
    password: "",
    profilePic: "",
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
    const lowerQuery = query.toLowerCase();

    const filtered = users.filter(
      (user) =>
        user.userId.toLowerCase().includes(lowerQuery) ||
        user.name.toLowerCase().includes(lowerQuery)
    );

    setFilteredUsers(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const resetForm = () => {
    setNewUser({
      email: "",
      name: "",
      phone: "",
      role: "Analyst",
      password: "",
      profilePic: "",
    });
    setEditingIndex(null);
  };

  const addOrUpdateUser = async (e) => {
    e.preventDefault();

    if (!newUser.email || !newUser.name || !newUser.phone || !newUser.role || !newUser.password || !newUser.profilePic) {
      alert("All fields are required!");
      return;
    }

    if (editingIndex !== null) {
      // Update user logic
      const response = await fetch(`/api/user/${newUser.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        alert("User updated successfully!");
        const updatedUsers = [...users];
        updatedUsers[editingIndex] = { ...newUser };
        setUsers(updatedUsers);
      } else {
        alert("Failed to update user.");
      }
    } else {
      // Add a new user via API
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        alert("User created successfully!");
        const createdUser = await response.json();
        setUsers([...users, createdUser]);
      } else {
        alert("Failed to create user.");
      }
    }

    setShowModal(false);
    resetForm();
  };

  const openEditModal = (index) => {
    setEditingIndex(index);
    setNewUser(users[index]);
    setShowModal(true);
  };

  const deleteUser = async () => {
    const userIdToDelete = users[editingIndex]?.email;

    if (userIdToDelete) {
      const response = await fetch(`/api/user/${userIdToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert("User deleted successfully!");
        setUsers(users.filter((_, index) => index !== editingIndex));
      } else {
        alert("Failed to delete user.");
      }
    }

    setShowDeleteModal(false);
    setEditingIndex(null);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-center text-4xl font-bold text-customBlue mb-8">
        User Management
      </h1>

      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search by User ID or Name"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-1/2 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-customPink"
        />
        <button
          className="ml-4 px-4 py-2 bg-customPink text-white rounded-lg hover:bg-customBlue transition duration-200"
          onClick={() => setShowModal(true)}
        >
          + Add New User
        </button>
      </div>

      <div className="overflow-x-auto max-h-[28vw] relative">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="sticky top-0 bg-customPink text-white z-20">
            <tr>
              <th className="py-2 px-4 border">User ID (Email)</th>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Phone Number</th>
              <th className="py-2 px-4 border">Role</th>
              <th className="py-2 px-4 border">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? filteredUsers.map((user, index) => (
              <tr key={index} className="text-left">
                <td className="py-2 px-4 border">{user.email}</td>
                <td className="py-2 px-4 border flex items-center space-x-2">
                  <img
                    src={user.profilePic}
                    alt={`${user.name}'s profile`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span>{user.name}</span>
                </td>
                <td className="py-2 px-4 border">{user.phone}</td>
                <td className="py-2 px-4 border">{user.role}</td>
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
            )) : <tr><td colSpan="5" className="text-center py-4">No users found.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {editingIndex !== null ? "Edit User" : "Add New User"}
            </h2>
            <form onSubmit={addOrUpdateUser} className="space-y-4">
              <div>
                <label htmlFor="userId">User ID (Email)</label>
                <input
                  type="email"
                  id="userId"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newUser.name}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={newUser.phone}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  value={newUser.role}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Analyst">Analyst</option>
                  <option value="Billing Specialist">Billing Specialist</option>
                </select>
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label htmlFor="profilePic">Profile Picture URL</label>
                <input
                  type="text"
                  id="profilePic"
                  name="profilePic"
                  value={newUser.profilePic}
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
                  className="px-4 py-2 bg-customPink text-white rounded hover:bg-customBlue"
                >
                  {editingIndex !== null ? "Save Changes" : "Create User"}
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
            <h2 className="text-xl font-bold mb-4">Delete User</h2>
            <p>
              Are you sure you want to delete <strong>{users[editingIndex]?.name}</strong>?
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
