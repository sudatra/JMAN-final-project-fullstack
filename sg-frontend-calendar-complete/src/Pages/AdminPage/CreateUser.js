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
    <div class="bg-gray-100 min-h-screen flex flex-col justify-center items-center">
      <div class="bg-white p-10 rounded-lg shadow-lg">
        <h1 class="text-4xl font-bold mb-8">Welcome, Admin!</h1>
        <form onSubmit={handleSubmit} class="create-event-form space-y-4">
          <h2 class="text-2xl font-bold">Create User</h2>
          <div class="create-event-container">
            <div class="event-container-left">
              <div class="form-group">
                <label class="block font-medium text-gray-800">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  required
                  class="create-event-input-field bg-gray-200"
                />
              </div>
              <div class="form-group">
                <label class="block font-medium text-gray-800">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  required
                  class="create-event-input-field bg-gray-200"
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            class="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-gray-800"
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
