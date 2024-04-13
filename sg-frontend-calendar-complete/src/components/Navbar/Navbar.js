import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const jwtToken = localStorage.getItem("userToken");

  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchUserDetails = async () => {
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
          "http://localhost:3000/user-details",
          config
        );

        // console.log(response);
        setUserData(response.data);
      } catch (error) {
        console.error("Failed to fetch user details", error);
      }
    };

    fetchUserDetails();
  }, [jwtToken, navigate]);

  const handleLogout = () => {
    toast.success("Successfully Logged Out User", {
      autoClose: 1000,
    });

    setTimeout(() => {
      localStorage.removeItem("userToken");
      navigate("/");
    }, 1500);
  };

  return (
    <nav className="bg-gray-100 p-4">
      <ul className="flex justify-between items-center flex-wrap">
        <li className="p-2 mr-6 border border-gray-300 rounded-lg">
          <Link to="/user" className="text-black hover:text-gray-300">Home</Link>
        </li>
        <li className="p-2 mr-6 border border-gray-300 rounded-lg">
          <Link to="/all-events" className="text-black hover:text-gray-300">Upcoming Events</Link>
        </li>
        <li className="p-2 mr-6 border border-gray-300 rounded-lg">
          <Link to="/user-calendar" className="text-black hover:text-gray-300">User Calendar</Link>
        </li>
        <li className="flex items-center gap-4">
          <Link to={`/user/profile/${userData._id}`} className="text-black hover:text-gray-300">
            <div>{userData.email}</div>
          </Link>
          <button className="p-2 border border-gray-300 rounded-lg hover:text-gray-300" onClick={handleLogout}>
            <img src="https://th.bing.com/th/id/OIP.ukdG02QuyYNWdgkvOYceCgHaIz?rs=1&pid=ImgDetMain" alt="Logout" className="w-6 h-6" />
          </button>
        </li>
      </ul>

      <ToastContainer />
    </nav>

  );
};

export default Navbar;
