"use client";
import { useState } from "react";
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";

function UserManagement() {
  const dummyUsers = [
    {
      userId: "AjaySuperAdmin@jkare.com",
      name: "Ajay Verma",
      phoneNumber: "123-456-7890",
      role: "Super Admin",
      password: "superadmin123",
      profile_pic: "https://hexerve.com/wp-content/uploads/2024/09/Untitled-design-25.png"
    },
    {
      userId: "AtulAnalyst@jkare.com",
      name: "Atul Verma",
      phoneNumber: "987-654-3210",
      role: "Analyst",
      password: "analyst456",
      profile_pic: "https://hexerve.com/wp-content/uploads/2024/09/7.png"
    },
    {
      userId: "ShivamBillingSpecialist@jkare.com",
      name: "Shivam Awasthi",
      phoneNumber: "555-123-4567",
      role: "Billing Specialist",
      password: "billing789",
      profile_pic: "https://hexerve.com/wp-content/uploads/2024/09/1.png"
    },

    {
      userId: "AkashBillingSpecialist@jkare.com",
      name: "Akash sharma",
      phoneNumber: "568-353-4568",
      role: "Billing Specialist",
      password: "billing789",
      profile_pic: "https://hexerve.com/wp-content/uploads/2024/09/5.png"
    },
    {
      userId: "KashishAnalyst@jkare.com",
      name: "Kashish sharma",
      phoneNumber: "865-289-3869",
      role: "Analyst",
      password: "billing789",
      profile_pic: "https://hexerve.com/wp-content/uploads/2024/09/8.png"
    },
    {
      userId: "MohitSuperAdmin@jkare.com",
      name: "Mohit Sharma",
      phoneNumber: "695-556-7284",
      role: "Super Admin",
      password: "billing789",
      profile_pic: "https://hexerve.com/wp-content/uploads/2024/09/9.png"
    },

  ];

  const [users, setUsers] = useState(dummyUsers);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(dummyUsers);
  const [passwordVisibility, setPasswordVisibility] = useState({});

  const [newUser, setNewUser] = useState({
    userId: "",
    name: "",
    phoneNumber: "",
    role: "Analyst",
    password: "",
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
      userId: "",
      name: "",
      phoneNumber: "",
      role: "Analyst",
      password: "",
    });
    setEditingIndex(null);
  };

  const addOrUpdateUser = (e) => {
    e.preventDefault();

    const { userId, name, phoneNumber, role, password } = newUser;

    if (!userId || !name || !phoneNumber || !role || !password) {
      alert("Please fill in all the fields before saving the user.");
      return;
    }

    if (editingIndex !== null) {
      // Update the existing user
      const updatedUsers = [...users];
      updatedUsers[editingIndex] = { ...newUser }; // Update the user at editingIndex
      setUsers(updatedUsers); // Save the updated list back to state
    } else {
      // Add a new user
      setUsers([...users, newUser]);
    }

    setShowModal(false); // Close the modal
    resetForm(); // Reset the form state
  };


  const openEditModal = (index) => {
    setEditingIndex(index);
    setNewUser(users[index]);
    setShowModal(true);
  };

  const deleteUser = () => {
    setUsers(users.filter((_, index) => index !== editingIndex));
    setShowDeleteModal(false);
    setEditingIndex(null);
  };

  const togglePasswordVisibility = (index) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
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
              <th className="py-2 px-4 border">Password</th>
              <th className="py-2 px-4 border">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={index} className="text-left">
                <td className="py-2 px-4 border">{user.userId}</td>
                <td className="py-2 px-4 border flex items-center space-x-2">
                  <img
                    src={user.profile_pic}
                    alt={`${user.name}'s profile`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span>{user.name}</span>
                </td>
                <td className="py-2 px-4 border">{user.phoneNumber}</td>
                <td className="py-2 px-4 border">{user.role}</td>
                <td className="py-2 px-4 border">
                  <span>
                    {passwordVisibility[index] ? user.password : "••••••••"}
                  </span>
                  <button
                    className="ml-2 text-gray-600 hover:text-gray-800"
                    onClick={() => togglePasswordVisibility(index)}
                  >
                    {passwordVisibility[index] ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </td>
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
                  name="userId"
                  value={newUser.userId}
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
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={newUser.phoneNumber}
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
                  type={editingIndex !== null ? "text" : "password"}
                  id="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label htmlFor="profile_pic">Profile Picture URL</label>
                <input
                  type="text"
                  id="profile_pic"
                  name="profile_pic"
                  value={newUser.profile_pic || ""}
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
