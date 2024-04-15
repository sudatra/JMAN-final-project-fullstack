import axios from "axios";
import React, { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link, useNavigate } from "react-router-dom";
import MediaCard from "../../components/EventCards/EventCard";
import Navbar from "../../components/Navbar/Navbar";

function UserPage() {
  const [userDetails, setUserDetails] = useState({});
  const jwtToken = localStorage.getItem("userToken");

  const navigate = useNavigate();

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

        setUserDetails(response.data);
      } catch (error) {
        console.error("Failed to fetch user details", error);
      }
    };

    fetchUserDetails();
  }, [jwtToken, navigate]);

  const [eventDetails, setEventDetails] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState(null);
  const [trainerSearchQuery, setTrainerSearchQuery] = useState("");
  const [eventSearchQuery, setEventSearchQuery] = useState("");
  const [topUpcomingEvents, setTopUpcomingEvents] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState(null);

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

  useEffect(() => {
    if (eventDetails) {
      const upcoming = eventDetails.filter(
        (event) => new Date() < new Date(event.date)
      );
      setUpcomingEvents(upcoming);
      filterTopEvents(upcoming);
    }
  }, [eventDetails]);

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/user-event-fetch/${userDetails._id}`
        );
        setRegisteredEvents(response.data);
      } catch (error) {
        console.log("Error fetching Registered Events", error);
      }
    };

    fetchRegisteredEvents();
  }, [userDetails]);

  const filteredEvents = upcomingEvents
    ? upcomingEvents.filter((event) => {
        const eventNameMatch =
          event.name.toLowerCase().indexOf(eventSearchQuery.toLowerCase()) !==
          -1;
        const trainerNameMatch =
          event.trainer
            .toLowerCase()
            .indexOf(trainerSearchQuery.toLowerCase()) !== -1;

        return eventNameMatch && trainerNameMatch;
      })
    : [];

  const registeredUpcomingEvents = upcomingEvents?.filter((event) =>
    registeredEvents?.some(
      (registeredEvent) => registeredEvent.eventId === event._id
    )
  );

  const filterTopEvents = (upcomingEvents) => {
    upcomingEvents?.sort((a, b) => new Date(a.date) - new Date(b.date));
    let topEvents = [];

    for (var i = 0; i < Math.min(5, upcomingEvents?.length); i++) {
      topEvents.push(upcomingEvents[i]);
    }
    setTopUpcomingEvents(topEvents);
  };

  return jwtToken ? (
    <>
      <Navbar />
      <div className="mt-5 overflow-x-hidden bg-gray-200">
        <div className="mt-5">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="text-3xl flex justify-center">Top Events</h2>
          </div>
          <div className="flex justify-evenly items-center flex-wrap gap-4 w-full mt-3 overflow-x-hidden">
            {topUpcomingEvents?.map((event, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <Link
                  to={`/event/${event._id}`}
                  className="text-decoration-none"
                >
                  <MediaCard eventDetail={event} isPast={false} />
                </Link>
              </div>
            ))}
          </div>

          <Link to="/all-events" className="flex flex-end justify-end mr-5">
            <button className="login-button bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-gray-800">
              Show More
            </button>
          </Link>
        </div>

        <div className="mx-auto">
          <h2 className="text-3xl flex justify-center">Your Events</h2>
          <div className="items-center flex flex-wrap gap-4 justify-evenly w-full overflow-x-hidden mt-3 ">
            {registeredUpcomingEvents?.map((event, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <MediaCard eventDetail={event} isPast={false} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  ) : (
    <h1 className="text-black text-4xl flex justify-center">
      you are not an user!!!
    </h1>
  );
}

export default UserPage;
