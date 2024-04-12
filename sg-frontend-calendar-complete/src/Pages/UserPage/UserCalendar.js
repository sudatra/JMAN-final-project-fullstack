import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";

const localizer = momentLocalizer(moment);

const UserCalendar = () => {
  const [userDetails, setUserDetails] = useState({});
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const fetchedEvents = useRef(null);
  const [registeredData, setRegisteredData] = useState([]);

  const navigate = useNavigate();

  const jwtToken = localStorage.getItem("userToken");

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

  useEffect(() => {
    const fetchRegisteredEventsData = async () => {
      try {
        // Fetch all events for each eventId in registeredEvents
        const fetchEventsPromises = registeredEvents?.map(async (event) => {
          try {
            const eventResponse = await axios.get(
              `http://localhost:3000/fetch-event/${event.eventId}`
            );

            return eventResponse.data;
          } catch (error) {
            console.error("Error fetching event", error);
          }
        });

        // Wait for all event fetch requests to complete
        await Promise.all(fetchEventsPromises)
          .then((eventsData) => {
            const filteredEventsData = eventsData.filter(
              (event) => event !== undefined
            );

            fetchedEvents.current = filteredEventsData;
          })
          .catch((e) => console.error("Unable to resolve promise", e));

        const formattedEvents = fetchedEvents.current?.map((event) => {
          const startDate = new Date(event.date + "T" + event.startTime);
          const endDate = new Date(event.date + "T" + event.endTime);

          return {
            ...event,
            start: startDate,
            end: endDate,
            title: event.name,
          };
        });

        setRegisteredData(formattedEvents);
      } catch (error) {
        console.log("Error fetching Registered Events", error);
      }
    };

    if (userDetails._id) {
      fetchRegisteredEventsData();
    }
  }, [userDetails, registeredEvents]);

  const eventStyleGetter = (event, start, end, isSelected) => {
    let newStyle = {
      backgroundColor: "lightgrey",
      color: "black",
      borderRadius: "Opx",
      border: "none",
    };

    if (new Date() > new Date(event.date)) {
      newStyle.backgroundColor = "red";
    } else {
      newStyle.backgroundColor = "green";
    }

    return {
      className: "",
      style: newStyle,
    };
  };

  return jwtToken ? (
    <div>
      <Calendar
        localizer={localizer}
        events={registeredData}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  ) : (
    <h1 className="text-black text-4xl flex justify-center">
      you are not an user!!!
    </h1>
  );
};

export default UserCalendar;
