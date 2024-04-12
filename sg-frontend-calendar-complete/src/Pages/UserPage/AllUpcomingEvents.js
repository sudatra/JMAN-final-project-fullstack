import React from "react";
import UpcomingEvents from "../AdminPage/UpcomingEvents";
import Navbar from "../../components/Navbar/Navbar";

const AllUpcomingEvents = () => {
  return (
    <>
      <Navbar />
      <UpcomingEvents isAdmin={false} />
    </>
  );
};

export default AllUpcomingEvents;
