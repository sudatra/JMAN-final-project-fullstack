import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const adminToken = localStorage.getItem("adminToken");
  const userToken = localStorage.getItem("userToken");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });

      const data = response.data;

      toast.success("Successfull Login", {
        autoClose: 1000,
      });

      setTimeout(() => {
        localStorage.setItem(`${data.userType}Token`, data.token);
        // Redirect based on user type
        if (data.userType === "admin") {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      }, 1500);
    } catch (error) {
      toast.error("Failed to Login", {
        autoClose: 1000,
      });
    }
  };

  return (!adminToken && userToken) || (adminToken && !userToken) ? (
    <h1 className="text-black text-4xl flex justify-center">
      You are already logged in !!!
    </h1>
  ) : (
    <div className="login-page bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="main-container">
        <div className="login-form-container bg-white p-8 rounded shadow-md">
          <h2 className="login-heading text-2xl font-bold mb-4">Login</h2>
          <form className="login-form space-y-4" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-semibold"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="login-input block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 font-semibold"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="login-input block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="login-button bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-gray-800"
            >
              Login
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
