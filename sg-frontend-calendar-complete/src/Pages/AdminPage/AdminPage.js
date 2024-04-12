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
    <div class="admin-page bg-gray-100 min-h-screen flex flex-col justify-center items-center">
      <h1 class="text-4xl font-bold mb-8">Hello Admin!!</h1>
      <div class="admin-activity flex flex-wrap justify-center gap-4">
        <Link to="/create-user">
          <button class="create-user bg-white py-6 px-8 rounded-lg shadow-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <TiUserAdd class="activity-icon text-4xl mb-2" />
            <p class="activity-title text-xl font-semibold">Create User</p>
          </button>
        </Link>
        <Link to="/create-event">
          <button class="create-event bg-white py-6 px-8 rounded-lg shadow-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <MdOutlineEventNote class="activity-icon text-4xl mb-2" />
            <p class="activity-title text-xl font-semibold">Create Event</p>
          </button>
        </Link>
        <Link to="/upcoming-event">
          <button class="upcoming-events bg-white py-6 px-8 rounded-lg shadow-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <MdOutlineEventRepeat class="activity-icon text-4xl mb-2" />
            <p class="activity-title text-xl font-semibold">Upcoming Events</p>
          </button>
        </Link>
        <Link to="/past-events">
          <button class="past-events bg-white py-6 px-8 rounded-lg shadow-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <MdEventAvailable class="activity-icon text-4xl mb-2" />
            <p class="activity-title text-xl font-semibold">Past Events</p>
          </button>
        </Link>
        <Link to="/admin-calendar">
          <button class="past-events bg-white py-6 px-8 rounded-lg shadow-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <MdEventAvailable class="activity-icon text-4xl mb-2" />
            <p class="activity-title text-xl font-semibold">Admin Calendar</p>
          </button>
        </Link>
      </div>
      <div>
        <button
          onClick={handleLogout}
          class="mt-8 bg-black text-white py-2 px-6 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-gray-800"
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
