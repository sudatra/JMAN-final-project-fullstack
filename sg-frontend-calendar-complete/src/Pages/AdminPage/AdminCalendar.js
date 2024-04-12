import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";

const localizer = momentLocalizer(moment);

const AdminCalendar = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [adminDetails, setAdminDetails] = useState({});

  const adminToken = localStorage.getItem("adminToken");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        if (!adminToken) {
          alert("Please Login!!!");
          navigate("/");
        }

        const config = {
          headers: {
            Authorization: `Bearer ${adminToken}`,
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
  }, [adminToken, navigate]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get("http://localhost:3000/fetch-events");

        const formattedEvents = response.data.map((event) => {
          const startDate = new Date(event.date + "T" + event.startTime);
          const endDate = new Date(event.date + "T" + event.endTime);

          return {
            ...event,
            start: startDate,
            end: endDate,
            title: event.name,
          };
        });

        setAllEvents(formattedEvents);
      } catch (error) {
        console.error("Failed to fetch user details", error);
      }
    };

    fetchEventDetails();
  }, []);

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

  return adminToken ? (
    <div>
      <Calendar
        localizer={localizer}
        events={allEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  ) : (
    <h1 className="text-black text-4xl flex justify-center">
      you are not an admin!!!
    </h1>
  );
};

export default AdminCalendar;
