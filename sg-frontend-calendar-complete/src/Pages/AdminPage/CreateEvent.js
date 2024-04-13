import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateEvent = () => {
  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    trainer: "",
    imgUrl: "",
    capacity: 0,
    registered: 0,
    resourceLink: "",
    domain: "",
  });

  const navigate = useNavigate();
  const adminToken = localStorage.getItem("adminToken");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData({
      ...eventData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/create-event",
        eventData
      );
      toast.success("Successfully created Event", {
        autoClose: 1000,
      });

      setTimeout(() => {
        setEventData({
          name: "",
          description: "",
          date: "",
          startTime: "",
          endTime: "",
          location: "",
          trainer: "",
          imgUrl: "",
          capacity: 0,
          registered: 0,
          resourceLink: "",
          domain: "",
        });
        navigate("/admin");
      }, 1500);
    } catch (error) {
      console.error("There was an error creating the event:", error.message);
      toast.error("Failed to create event!!!", {
        autoClose: 1000,
      });
    }
  };

  return adminToken ? (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center">
      <div className="bg-white py-10 px-20 rounded-lg shadow-lg max-w-4xl w-full">
        <h1 className="text-4xl font-bold mb-8">Welcome, Admin!</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold">Create Event</h2>

          <div className="space-y-4">
            <div className="form-group">
              <label className="block font-medium text-gray-700">Name:</label>
              <input
                type="text"
                name="name"
                className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                value={eventData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="block font-medium text-gray-700">Description:</label>
              <textarea
                name="description"
                className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                value={eventData.description}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label className="block font-medium text-gray-700">Trainer:</label>
              <input
                type="text"
                name="trainer"
                className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                value={eventData.trainer}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-700">Date:</label>
                <input
                  type="date"
                  name="date"
                  className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                  value={eventData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700">Start Time:</label>
                <input
                  type="time"
                  name="startTime"
                  className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                  value={eventData.startTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700">End Time:</label>
                <input
                  type="time"
                  name="endTime"
                  className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                  value={eventData.endTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="block font-medium text-gray-700">Location:</label>
              <input
                type="text"
                name="location"
                className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                value={eventData.location}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="block font-medium text-gray-700">Image URL:</label>
              <input
                type="text"
                name="imgUrl"
                className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                value={eventData.imgUrl}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="block font-medium text-gray-700">Capacity:</label>
              <input
                type="number"
                name="capacity"
                className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                value={eventData.capacity}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="block font-medium text-gray-700">Registered:</label>
              <input
                type="number"
                name="registered"
                className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                value={eventData.registered}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="block font-medium text-gray-700">Resource Link:</label>
              <input
                type="text"
                name="resourceLink"
                className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                value={eventData.resourceLink}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">Domain:</label>
                <input
                  type="text"
                  name="domain"
                  className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                  value={eventData.domain}
                  onChange={handleInputChange}
                  required
                />
           </div>

            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-gray-800 transition duration-150 ease-in-out"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>

  ) : (
    <h1 className="text-black text-4xl flex justify-center">
      you are not an admin!!!
    </h1>
  );
};

export default CreateEvent;
