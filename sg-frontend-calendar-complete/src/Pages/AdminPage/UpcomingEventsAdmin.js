import React from "react";
import UpcomingEvents from "./UpcomingEvents";

const UpcomingEventsAdmin = () => {
  const adminToken = localStorage.getItem("adminToken");
  return adminToken ? (
    <UpcomingEvents isAdmin={true} />
  ) : (
    <h1 className="text-black text-4xl flex justify-center">
      you are not an admin!!!
    </h1>
  );
};

export default UpcomingEventsAdmin;
