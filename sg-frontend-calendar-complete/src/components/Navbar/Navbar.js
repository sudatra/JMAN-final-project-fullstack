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
      <ul className="flex flex-wrap justify-between items-center">
        <li className="mr-6 border border-gray-300 p-2 rounded-lg">
          <Link to="/user" className="text-black hover:text-gray-300">
            Home
          </Link>
        </li>
        {/* <li className="mr-6 border border-gray-300 p-2 rounded-lg">
          <Link
            to={`/user/profile/${userData._id}`}
            className="text-black hover:text-gray-300"
          >
            Profile
          </Link>
        </li> */}
        <li className="mr-6 border border-gray-300 p-2 rounded-lg">
          <Link to="/all-events" className="text-black hover:text-gray-300">
            Upcoming Events
          </Link>
        </li>

        <li className="mr-6 border border-gray-300 p-2 rounded-lg">
          <Link to="/user-calendar" className="text-black hover:text-gray-300">
            User Calendar
          </Link>
        </li>

        <li className="flex gap-4">
          <Link
            to={`/user/profile/${userData._id}`}
            className="text-black hover:text-gray-300"
          >
            <div className="mt-2">{userData.email}</div>
          </Link>
          <button
            className="text-black hover:text-gray-300 p-2 rounded-lg"
            onClick={handleLogout}
          >
            <img
              src="https://th.bing.com/th/id/OIP.ukdG02QuyYNWdgkvOYceCgHaIz?rs=1&pid=ImgDetMain"
              alt="Logout"
              width={25}
              height={25}
            />
          </button>
        </li>
      </ul>

      <ToastContainer />
    </nav>
  );
};

export default Navbar;
