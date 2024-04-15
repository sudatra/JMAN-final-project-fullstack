import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EventPage = () => {
  const { eventId } = useParams();
  const [eventData, setEventData] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const [isRegistered, setIsRegistered] = useState(false);
  const [isInterested, setIsInterested] = useState(false);

  const [isCapacityFull, setIsCapacityFull] = useState(false);

  const jwtToken = localStorage.getItem("userToken");
  const userToken = localStorage.getItem("userToken");

  // console.log(jwtToken);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // const token = localStorage.getItem("token");
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
        setUserDetails(response.data);
      } catch (error) {
        console.error("Failed to fetch user details", error);
      }
    };

    fetchUserDetails();
  }, [jwtToken, navigate]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/fetch-event/${eventId}`
        );
        setEventData(response.data);

        if (eventData.registered >= eventData.capacity) {
          setIsCapacityFull(true);
        }

        // Check if the user is already registered for the event
        const registeredEvents = await axios.get(
          `http://localhost:3000/user-event-fetch/${userDetails._id}`
        );
        const isEventRegistered = registeredEvents.data.some(
          (event) => event.eventId === eventId
        );
        setIsRegistered(isEventRegistered);

        // Check if the user is already interested in the event
        const interestedEvents = await axios.get(
          `http://localhost:3000/user-event-interest-fetch/${userDetails._id}`
        );
        const isEventInterested = interestedEvents.data.some(
          (event) => event.eventId === eventId
        );
        setIsInterested(!isEventRegistered && !isEventInterested);
      } catch (error) {
        console.error("Error fetching the event: ", error);
      }
    };

    fetchEvent();
  }, [eventId, userDetails._id]);

  const handleRegister = async () => {
    try {
      if (eventData.registered === eventData.capacity - 1) {
        const registrationFullEmailResponse = await axios.post(
          "http://localhost:3000/registration-full-email",
          { eventId: eventId }
        );
      }
      const response = await axios.post(
        `http://localhost:3000/user-event-add/${userDetails._id}`,
        { eventId: eventData._id }
      );

      if (response.status === 400) {
        toast.error("Event already registered", {
          autoClose: 1000,
        });
      }

      toast.success("Event added for user", {
        autoClose: 1000,
      });

      setTimeout(() => {
        navigate("/user");
      }, 1500);
    } catch (error) {
      if (error.response.status === 400) {
        toast.error("Event already registered", {
          autoClose: 1000,
        });
      } else {
        toast.error("Error adding event", {
          autoClose: 1000,
        });
      }
    }
  };

  const handleInterest = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/user-event-interest/${userDetails._id}`,
        { eventId: eventId }
      );

      toast.success("Event interest added", {
        autoClose: 1000,
      });

      setTimeout(() => {
        navigate("/user");
      }, 1500);
    } catch (error) {
      if (error.response.status === 400) {
        toast.error("Event interest already added", {
          autoClose: 1000,
        });
      } else {
        toast.error("Failed to add event interest", {
          autoClose: 1000,
        });
      }
    }
  };

  return userToken ? (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div>
              <img
                className="object-cover w-full h-full"
                src={eventData.imgUrl}
                alt="Event Name"
              />
            </div>
            <div className="p-8">
              <h2 className="text-3xl font-bold mb-4">{eventData.name}</h2>
              <div className="mb-4">
                <p className="text-gray-700">{eventData.description}</p>
              </div>
              <div className="mb-4">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/2">
                    <p>
                      <strong>Date:</strong> {eventData.date}
                    </p>
                    <p>
                      <strong>Time:</strong> {eventData.startTime} -{" "}
                      {eventData.endTime}
                    </p>
                  </div>
                  <div className="md:w-1/2">
                    <p>
                      <strong>Location:</strong> {eventData.location}
                    </p>
                    <p>
                      <strong>Trainer:</strong> {eventData.trainer}
                    </p>
                    <p>
                      <strong>Training Resources: </strong>
                      <Link to={eventData.resourceLink} target="_blank">
                        <strong> Link</strong>
                      </Link>
                    </p>
                    <p>
                      <strong>Domain:</strong> {eventData.domain}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4">
                {!isRegistered && (
                  <button
                    className="login-button bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-gray-800"
                    onClick={handleRegister}
                    disabled={isRegistered || isCapacityFull}
                  >
                    Register
                  </button>
                )}
                {isInterested && (
                  <button
                    className="login-button bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-gray-800"
                    onClick={handleInterest}
                  >
                    Interested
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  ) : (
    <h1 className="text-black text-4xl flex justify-center">
      you are not an user!!!
    </h1>
  );
};

export default EventPage;
