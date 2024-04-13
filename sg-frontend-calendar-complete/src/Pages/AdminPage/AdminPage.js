import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

import { TiUserAdd } from "react-icons/ti";
import { MdOutlineEventRepeat } from "react-icons/md";
import { MdEventAvailable } from "react-icons/md";
import { MdOutlineEventNote } from "react-icons/md";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminPage() {
  const [eventDetails, setEventDetails] = useState(null);
  const [adminDetails, setAdminDetails] = useState({});

  const jwtToken = localStorage.getItem("adminToken");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        if (!jwtToken) {
          alert("Please Login!!!");
          navigate("/");
        }

        const config = {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        };

        const response = await axios.get(
          "http://localhost:3000/admin-details",
          config
        );

        setAdminDetails(response.data);
      } catch (error) {
        console.error("Failed to fetch admin details", error);
      }
    };

    fetchAdminDetails();
  }, [jwtToken, navigate]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get("http://localhost:3000/fetch-events");
        setEventDetails(response.data);
      } catch (error) {
        console.error("Failed to fetch user details", error);
      }
    };

    fetchEventDetails();
  }, []);

  const handleLogout = () => {
    toast.success("Successfully Logged out Admin", {
      autoClose: 1000,
    });

    setTimeout(() => {
      localStorage.removeItem("adminToken");
      navigate("/");
    }, 1500);
  };

  return jwtToken ? (

    <div className="admin-page bg-gray-100 min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-12">Hello Admin!</h1>
      <div className="admin-activity flex flex-row flex-wrap justify-center gap-4">
        <Link to="/create-user">
          <button className="create-user bg-white py-4 px-6 rounded-lg shadow-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out">
            <TiUserAdd className="activity-icon text-4xl text-blue-500 mb-2" />
            <p className="activity-title text-xl font-semibold text-gray-700">Create User</p>
          </button>
        </Link>
        <Link to="/create-event">
          <button className="create-event bg-white py-4 px-6 rounded-lg shadow-lg hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150 ease-in-out">
            <MdOutlineEventNote className="activity-icon text-4xl text-green-500 mb-2" />
            <p className="activity-title text-xl font-semibold text-gray-700">Create Event</p>
          </button>
        </Link>
        <Link to="/upcoming-event">
          <button className="upcoming-events bg-white py-4 px-6 rounded-lg shadow-lg hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-150 ease-in-out">
            <MdOutlineEventRepeat className="activity-icon text-4xl text-purple-500 mb-2" />
            <p className="activity-title text-xl font-semibold text-gray-700">Upcoming Events</p>
          </button>
        </Link>
        <Link to="/past-events">
          <button className="past-events bg-white py-4 px-6 rounded-lg shadow-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-150 ease-in-out">
            <MdEventAvailable className="activity-icon text-4xl text-red-500 mb-2" />
            <p className="activity-title text-xl font-semibold text-gray-700">Past Events</p>
          </button>
        </Link>
        <Link to="/admin-calendar">
          <button className="admin-calendar bg-white py-4 px-6 rounded-lg shadow-lg hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-150 ease-in-out">
            <MdEventAvailable className="activity-icon text-4xl text-orange-500 mb-2" />
            <p className="activity-title text-xl font-semibold text-gray-700">Admin Calendar</p>
          </button>
        </Link>
      </div>
      <div>
        <button
          onClick={handleLogout}
          className="mt-10 bg-black text-white py-2 px-6 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-gray-800 transition duration-150 ease-in-out"
        >
          LogOut
        </button>
      </div>
      <ToastContainer />
    </div>

  ) : (
    <h1 className="text-black text-4xl flex justify-center">
      you are not an admin!!!
    </h1>
  );
}

export default AdminPage;
