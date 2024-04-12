import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { MdEditSquare, MdDelete } from "react-icons/md";
import axios from "axios";

import { Link, useNavigate } from "react-router-dom";

const MediaCard = ({
  eventDetail,
  eventDetails,
  setEventDetails,
  isPast,
  isAdmin,
}) => {
  const navigate = useNavigate();

  const handleEdit = async () => {
    navigate(`/edit-event/${eventDetail._id}`);
  };

  const handleDelete = async (e) => {
    const eventId = eventDetail._id;

    try {
      const response = await axios.delete(
        `http://localhost:3000/delete-event/${eventId}`
      );
      console.log(response.data);

      const updatedEvents = eventDetails.filter(
        (event) => event._id !== eventId
      );

      // Update the state with the filtered array
      setEventDetails(updatedEvents);
    } catch (error) {
      console.log(`Error in deleting event ${eventDetail.name}: `, error);
    }
  };

  return (
    <>
      {isAdmin ? (
        <div className="max-w-xs rounded overflow-hidden shadow-lg bg-white">
          <Link to={`/admin-page/event/${eventDetail._id}`}>
            <div className="">
              <img
                src={eventDetail.imgUrl}
                alt="Event"
                className="w-full h-48 object-cover"
              />
            </div>
          </Link>
          <div className="px-6 py-4">
            <div className="font-bold text-xl text-gray-800 mb-2">
              {eventDetail.name}
            </div>
            <p className="text-black text-base mb-2">
              {eventDetail.description}
            </p>
            <p className="text-black text-base">
              Trainer name: {eventDetail.trainer}
            </p>
            <p className="text-black text-base">Date: {eventDetail.date}</p>
            <p className="text-black text-base">
              Time: {eventDetail.startTime} - {eventDetail.endTime}
            </p>
            <p className="text-black text-base">
              Location: {eventDetail.location}
            </p>
          </div>
          <div className="px-6 py-4 flex justify-center">
            {isPast ? (
              <></>
            ) : (
              <>
                <MdEditSquare
                  onClick={handleEdit}
                  className="card-icon text-indigo-500 hover:text-indigo-700 cursor-pointer mr-4"
                />
                <MdDelete
                  onClick={handleDelete}
                  className="card-icon text-purple-500 hover:text-purple-700 cursor-pointer"
                />
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-xs rounded overflow-hidden shadow-lg bg-white">
          <Link to={`/event/${eventDetail._id}`}>
            <div className="event-image-container">
              <img
                src={eventDetail.imgUrl}
                alt="Event"
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="px-6 py-4">
              <div className="font-bold text-xl text-gray-800 mb-2">
                {eventDetail.name}
              </div>
              <p className="text-black text-base mb-2">
                {eventDetail.description}
              </p>
              <p className="text-black text-base">
                Trainer name: {eventDetail.trainer}
              </p>
              <p className="text-black text-base">Date: {eventDetail.date}</p>
              <p className="text-black text-base">
                Time: {eventDetail.startTime} - {eventDetail.endTime}
              </p>
              <p className="text-black text-base">
                Location: {eventDetail.location}
              </p>
            </div>
          </Link>
        </div>
      )}
    </>
  );
};

export default MediaCard;
