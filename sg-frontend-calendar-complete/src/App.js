import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login/Login";
import AdminPage from "./Pages/AdminPage/AdminPage";
import UserPage from "./Pages/UserPage/UserPage";
import SendEmail from "./Pages/AdminPage/SendEmail";
import ResetPassword from "./Pages/UserPage/ResetPassword";
import CreateEvent from "./Pages/AdminPage/CreateEvent";
import CreateUserPage from "./Pages/AdminPage/CreateUser";
import EditEventPage from "./Pages/AdminPage/EditEvent";
import ErrorComponent from "./Pages/ErrorPage.js";
import UpcomingEvents from "./Pages/AdminPage/UpcomingEvents.js";
import PastEvents from "./Pages/AdminPage/PastEvents.js";
import ProfilePage from "./Pages/UserPage/ProfilePage.js";
import EventPage from "./Pages/UserPage/EventPage.js";
import AllUpcomingEvents from "./Pages/UserPage/AllUpcomingEvents.js";
import UpcomingEventsAdmin from "./Pages/AdminPage/UpcomingEventsAdmin.js";
import AdminEventPage from "./Pages/AdminPage/AdminEventPage.js";
import AdminCalendar from "./Pages/AdminPage/AdminCalendar.js";
import UserCalendar from "./Pages/UserPage/UserCalendar.js";
// import ProtectedRoute from "./components/utils/ProtectedRoute.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/user" element={<UserPage />} />

        <Route path="/send-email" element={<SendEmail />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/create-user" element={<CreateUserPage />} />
        <Route path="/edit-event/:eventId" element={<EditEventPage />} />
        <Route path="/upcoming-event" element={<UpcomingEventsAdmin />} />
        <Route path="/past-events" element={<PastEvents />} />
        <Route path="/user/profile/:userId" element={<ProfilePage />} />
        <Route path="/event/:eventId" element={<EventPage />} />
        <Route path="/all-events" element={<AllUpcomingEvents />} />
        <Route path="/admin-page/event/:eventId" element={<AdminEventPage />} />
        <Route path="/admin-calendar" element={<AdminCalendar />}/>
        <Route path="/user-calendar" element={<UserCalendar />}/>

        <Route path="*" component={ErrorComponent} />

        {/* Redirect user to the login page if route does not exist and user is not logged in */}
        <Route render={() => <h1>Page not found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
