import React, { useState, useEffect } from "react";
import MediaCard from "../../components/EventCards/EventCard.js";
import axios from "axios";

const UpcomingEvents = ({ isAdmin }) => {
  const [eventDetails, setEventDetails] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState(null);
  const [trainerSearchQuery, setTrainerSearchQuery] = useState("");
  const [eventSearchQuery, setEventSearchQuery] = useState("");

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
    }
  }, [eventDetails]);

  const handleTrainerSearchChange = (e) => {
    setTrainerSearchQuery(e.target.value);
  };

  const handleEventSearchChange = (e) => {
    setEventSearchQuery(e.target.value);
  };

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

  return (
    <div class="admin-page bg-gray-100 min-h-screen flex flex-col justify-center items-center">
      <h1 class="text-4xl font-bold mb-8">All Upcoming Events!</h1>
      <div class="admin-learning">
        <div class="flex justify-evenly items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Search by Trainer Name"
            value={trainerSearchQuery}
            onChange={handleTrainerSearchChange}
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
          />
          <input
            type="text"
            placeholder="Search by Event Name"
            value={eventSearchQuery}
            onChange={handleEventSearchChange}
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div class="upcoming-events-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((event, index) => (
            <MediaCard
              key={index}
              eventDetail={event}
              isPast={false}
              isAdmin={isAdmin}
              class="mb-4"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpcomingEvents;
