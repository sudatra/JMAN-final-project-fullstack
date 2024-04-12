import React, { useEffect, useState } from "react";
import MediaCard from "../../components/EventCards/EventCard.js";
import axios from "axios";

const PastEvents = () => {
  const [eventDetails, setEventDetails] = useState(null);
  const [pastEvents, setPastEvents] = useState(null);
  const [trainerSearchQuery, setTrainerSearchQuery] = useState("");
  const [eventSearchQuery, setEventSearchQuery] = useState("");

  const adminToken = localStorage.getItem("adminToken");

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
      const past = eventDetails.filter(
        (event) => new Date() > new Date(event.date)
      );

      setPastEvents(past);
    }
  }, [eventDetails]);

  const handleTrainerSearchChange = (e) => {
    setTrainerSearchQuery(e.target.value);
  };

  const handleEventSearchChange = (e) => {
    setEventSearchQuery(e.target.value);
  };

  const filteredEvents = pastEvents
    ? pastEvents.filter((event) => {
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

  return adminToken ? (
    <div class="admin-page bg-gray-100 min-h-screen flex flex-col justify-center items-center">
      <h1 class="text-4xl font-bold mb-8">Past Events!</h1>
      <div class="admin-learning">
        <div class="flex justify-evenly items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Search by Trainer Name"
            value={trainerSearchQuery}
            onChange={handleTrainerSearchChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
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
              isPast={true}
              isAdmin={adminToken}
              class="mb-4"
            />
          ))}
        </div>
      </div>
    </div>
  ) : (
    <h1 className="text-black text-4xl flex justify-center">
      you are not an admin!!!
    </h1>
  );
};

export default PastEvents;
