import React, { useState } from "react";
import axios from "axios";

function SendEmail() {
  const [userEmail, setUserEmail] = useState("");
  const adminToken = localStorage.getItem("adminToken");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/send-email", {
        userEmail,
      });
      alert(response.data.message);
    } catch (error) {
      console.error("Error sending email:", error);
      alert(error);
    }
  };

  return adminToken ? (
    <div className="max-w-md mx-auto mt-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <h2 className="block text-gray-700 text-lg font-bold mb-2">
          Send Email
        </h2>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="userEmail"
          >
            User Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="userEmail"
            type="email"
            placeholder="User Email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="login-button bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-gray-800"
            type="submit"
          >
            Send Email
          </button>
        </div>
      </form>
    </div>
  ) : (
    <h1 style={{ color: "white" }}>you are not an admin!!!</h1>
  );
}

export default SendEmail;
