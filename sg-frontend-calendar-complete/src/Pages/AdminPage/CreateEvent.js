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
    <div class="bg-gray-100 min-h-screen flex flex-col justify-center items-center">
      <div class="bg-white py-10 px-20 rounded-lg shadow-lg">
        <h1 class="text-4xl font-bold mb-8">Welcome, Admin!</h1>
        <form class="space-y-4">
          <h2 class="text-2xl font-bold">Create Event</h2>
          <form class="space-y-4 create-event-form">
            <h2 class="activity-title">Create Event</h2>

            <div>
              <label class="block font-medium text-black">Name:</label>
              <input
                type="text"
                name="name"
                class="bg-gray-200"
                value={eventData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label class="block font-medium text-black">Description:</label>
              <textarea
                type="text"
                name="description"
                class="bg-gray-200"
                value={eventData.description}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            <div>
              <label class="block font-medium text-black">Trainer:</label>
              <input
                type="text"
                name="trainer"
                class="bg-gray-200"
                value={eventData.trainer}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label class="block font-medium text-black">Date:</label>
              <input
                type="date"
                name="date"
                class="bg-gray-200"
                value={eventData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label class="block font-medium text-black">Start Time:</label>
              <input
                type="time"
                name="startTime"
                class="bg-gray-200"
                value={eventData.startTime}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label class="block font-medium text-black">End Time:</label>
              <input
                type="time"
                name="endTime"
                class="bg-gray-200"
                value={eventData.endTime}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label class="block font-medium text-black">Location:</label>
              <input
                type="text"
                name="location"
                class="bg-gray-200"
                value={eventData.location}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label class="block font-medium text-black">Image Url:</label>
              <input
                type="text"
                name="imgUrl"
                class="bg-gray-200"
                value={eventData.imgUrl}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label class="block font-medium text-black">Capacity:</label>
              <input
                type="number"
                name="capacity"
                class="bg-gray-200"
                value={eventData.capacity}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label class="block font-medium text-black">Registered:</label>
              <input
                type="number"
                name="registered"
                class="bg-gray-200"
                value={eventData.registered}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label class="block font-medium text-black">Resource Link:</label>
              <input
                type="text"
                name="resourceLink"
                class="bg-gray-200"
                value={eventData.resourceLink}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label class="block font-medium text-black">Domain:</label>
              <input
                type="text"
                name="domain"
                class="bg-gray-200"
                value={eventData.domain}
                onChange={handleInputChange}
                required
              />
            </div>

            <button
              type="submit"
              class="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-gray-800"
              onClick={handleSubmit}
            >
              Create Event
            </button>
          </form>
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
