import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

const AdminEventPage = () => {
  const { eventId } = useParams();
  const [eventData, setEventData] = useState({});
  const [adminDetails, setAdminDetails] = useState(null);
  const [EventInterestedUsers, setEventInterestedUsers] = useState(null);
  const [usersDetails, setUsersDetails] = useState([]);

  const jwtToken = localStorage.getItem("adminToken");

  // console.log(jwtToken);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminDetails = async () => {
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
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/fetch-event/${eventId}`
        );

        setEventData(response.data);
      } catch (error) {
        console.error("Error fetching the event: ", error);
      }
    };

    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    const fetchInterestedUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/event-interests/${eventId}`
        );

        setEventInterestedUsers(response.data);
      } catch (error) {
        console.error("Error fetching the event: ", error);
      }
    };

    fetchInterestedUser();
  }, [eventId]);

  useEffect(() => {
    const fetchUsersDetails = async () => {
      try {
        const promises = EventInterestedUsers.map(async (interest) => {
          const response = await axios.get(
            `http://localhost:3000/fetch-user-detail/${interest.userId}`
          );
          return response.data;
        });
        const usersDetails = await Promise.all(promises);
        setUsersDetails(usersDetails);
      } catch (error) {
        console.error("Error fetching users details: ", error);
      }
    };

    if (EventInterestedUsers?.length > 0) {
      fetchUsersDetails();
    }
  }, [EventInterestedUsers]);

  return jwtToken ? (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="w-full">
          <img
            className="learning-image w-full"
            src={eventData.imgUrl}
            alt="Event Name"
          />
        </div>
        <div className="bg-gray-200 rounded-lg p-6">
          <h2 className="event-heading text-2xl font-bold mb-4">
            {eventData.name}
          </h2>
          <div className="event-details">
            <p className="event-description">{eventData.description}</p>
            <div className="event-info mt-4">
              <p className="font-semibold">Date: {eventData.date}</p>
              <p className="font-semibold">
                Time: {eventData.startTime} - {eventData.endTime}
              </p>
              <p className="font-semibold">Location: {eventData.location}</p>
              <p className="font-semibold">Trainer: {eventData.trainer}</p>
              <p className="font-semibold">Capacity: {eventData.capacity}</p>
              <p className="font-semibold">
                Registered: {eventData.registered}
              </p>
              <p className="font-semibold">
                <strong>Training Resources: </strong>
                <Link to={eventData.resourceLink} target="_blank">
                  <strong> Link</strong>
                </Link>
              </p>
              <p className="font-semibold">Domain: {eventData.domain}</p>
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-bold mt-8 mb-4">Interested Users:</h3>
          <ul>
            {usersDetails?.map((user, index) => (
              <li key={index}>{user.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <h1 className="text-black text-4xl flex justify-center">
      you are not an admin!!!
    </h1>
  );
};

export default AdminEventPage;
