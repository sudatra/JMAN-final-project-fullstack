import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");

  const adminToken = localStorage.getItem("adminToken");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:3000/reset-password/${token}`,
        { newPassword }
      );

      toast.success("Password successfully changed", {
        autoClose: 1000,
      });

      setTimeout(() => {
        navigate("/");
      });
    } catch (error) {
      toast.error("Unable to update password", {
        autoClose: 1000,
      });
    }
  };

  return !adminToken ? (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="admin-form-container bg-white shadow-lg rounded-lg p-8">
        <h3 className="text-2xl font-bold text-center mb-4">
          Reset your password
        </h3>
        <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
          <div>
            <label htmlFor="password" className="block font-medium">
              New Password
            </label>
            <input
              type="password"
              placeholder="New Password"
              id="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input-field bg-gray-100 border-gray-300 mt-4 h-10"
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="submit-button">
              Update Password
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  ) : (
    <h1>You cannot reset any user's password</h1>
  );
}

export default ResetPassword;
