import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CreateUserPage() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    // password: "",
  });
  const navigate = useNavigate();

  const adminToken = localStorage.getItem("adminToken");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/user", userData);

      toast.success("Successfully created User", {
        autoClose: 1000,
      });

      setUserData({ name: "", email: "" });
    } catch (error) {
      if (error.response.status === 400) {
        toast.error("User already present", {
          autoClose: 1000,
        });
        setUserData({ name: "", email: "" });
      } else {
        console.error("There was an error creating the user:", error.message);
        toast.error("Failed to create User", {
          autoClose: 1000,
        });
        setUserData({ name: "", email: "" });
      }
    }
  };

  return adminToken ? (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center p-4">
      <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-4xl font-bold mb-6">Welcome, Admin!</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold">Create User</h2>
          
          <div className="form-group">
            <label htmlFor="name" className="block text-lg font-medium text-gray-700">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={userData.name}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-black text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-gray-800 transition duration-150 ease-in-out"
          >
            Create User
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>

  ) : (
    <h1 className="text-black text-4xl flex justify-center">
      you are not an admin!!!
    </h1>
  );
}

export default CreateUserPage;
