import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditEventPage = () => {
  const { eventId } = useParams();
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

  useEffect(() => {
    const fetchCurrentEvent = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/fetch-event/${eventId}`
        );

        setEventData(response.data);
      } catch (error) {
        console.error(`Failed to fetch user details ${eventId}`, error);
      }
    };

    fetchCurrentEvent();
  }, []);

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
        `http://localhost:3000/edit-event/${eventId}`,
        eventData
      );

      toast.success("Successfully edited the Event", {
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
      console.error("There was an error updating the event:", error.message);
      toast.error("Failed to edit event!!!", {
        autoClose: 1000,
      });
    }
  };

  return adminToken ? (
    <div class="bg-gray-100 min-h-screen flex flex-col justify-center items-center">
      <div class="bg-white p-10 rounded-lg shadow-lg">
        <h1 class="text-4xl font-bold mb-8">Welcome, Admin!</h1>
        <form onSubmit={handleSubmit} class="create-event-form space-y-4">
          <h2 class="text-2xl font-bold">Update Event</h2>

          <div class="form-group">
            <label class="block font-medium text-gray-800">Name:</label>
            <input
              type="text"
              name="name"
              value={eventData.name}
              onChange={handleInputChange}
              class="create-event-input-field bg-gray-200"
              required
            />
          </div>
          <div class="form-group">
            <label class="block font-medium text-gray-800">Description:</label>
            <textarea
              type="text"
              name="description"
              value={eventData.description}
              onChange={handleInputChange}
              class="create-event-textarea-field bg-gray-200"
              required
            ></textarea>
          </div>
          <div class="form-group">
            <label class="block font-medium text-gray-800">Trainer:</label>
            <input
              type="text"
              name="trainer"
              value={eventData.trainer}
              onChange={handleInputChange}
              class="create-event-input-field bg-gray-200"
              required
            />
          </div>

          <div class="form-group">
            <label class="block font-medium text-gray-800">Date:</label>
            <input
              type="date"
              name="date"
              value={eventData.date}
              onChange={handleInputChange}
              class="create-event-input-field bg-gray-200"
              required
            />
          </div>
          <div class="form-group">
            <label class="block font-medium text-gray-800">Start Time:</label>
            <input
              type="time"
              name="startTime"
              value={eventData.startTime}
              onChange={handleInputChange}
              class="create-event-input-field bg-gray-200"
              required
            />
          </div>
          <div class="form-group">
            <label class="block font-medium text-gray-800">End Time:</label>
            <input
              type="time"
              name="endTime"
              value={eventData.endTime}
              onChange={handleInputChange}
              class="create-event-input-field bg-gray-200"
              required
            />
          </div>
          <div class="form-group">
            <label class="block font-medium text-gray-800">Location:</label>
            <input
              type="text"
              name="location"
              value={eventData.location}
              onChange={handleInputChange}
              class="create-event-input-field bg-gray-200"
              required
            />
          </div>
          <div class="form-group">
            <label class="block font-medium text-gray-800">Image Url:</label>
            <input
              type="text"
              name="imgUrl"
              value={eventData.imgUrl}
              onChange={handleInputChange}
              class="create-event-input-field bg-gray-200"
              required
            />
          </div>
          <div class="form-group">
            <label class="block font-medium text-gray-800">Capacity:</label>
            <input
              type="number"
              name="capacity"
              value={eventData.capacity}
              onChange={handleInputChange}
              class="create-event-input-field bg-gray-200"
              required
            />
          </div>
          <div class="form-group">
            <label class="block font-medium text-gray-800">Registered:</label>
            <input
              type="number"
              name="registered"
              value={eventData.registered}
              onChange={handleInputChange}
              class="create-event-input-field bg-gray-200"
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
          >
            Update Event
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
};

export default EditEventPage;
