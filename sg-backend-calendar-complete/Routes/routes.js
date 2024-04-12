const express = require("express");

const adminController = require("../Controllers/AdminControllers");
const userController = require("../Controllers/UserControllers");
const eventController = require("../Controllers/EventControllers");
const skillController = require("../Controllers/SkillControllers");
const userSkillController = require("../Controllers/UserSkillControllers");
const userEventController = require("../Controllers/UserEventControllers");
const userEventInterestController = require("../Controllers/UserEventInterestControllers");
const { withAuthAdmin, withAuthUser } = require("../Middlewares/middlewares");

const router = express.Router();

// Admin routes
router.post("/admin", adminController.createAdmin);
router.get("/admin-details", withAuthAdmin, adminController.getAdminDetails);

// User routes
router.post("/user", userController.createUser);
router.get("/user-details", withAuthUser, userController.getUserDetails);
router.get("/fetch-all-users", userController.getAllUsers);
router.get("/fetch-user-detail/:userId", userController.getUserById);
router.post("/reset-password/:token", userController.resetPassword);
router.post("/login", userController.login);

// Event routes
router.post("/create-event", eventController.createEvent);
router.get("/fetch-events", eventController.getAllEvents);
router.get("/fetch-event/:eventId", eventController.getEventById);
router.post("/edit-event/:eventId", eventController.editEvent);
router.delete("/delete-event/:eventId", eventController.deleteEvent);
router.get("/event-interests/:eventId", eventController.getEventInterests);

// Skill routes
router.post("/add-skill", skillController.addSkill);
router.get("/fetch-skills", skillController.getAllSkills);
router.delete("/delete-skill/:skillId", skillController.deleteSkill);
router.get("/particular-skill-fetch/:skillId", skillController.getSkillById);

// User Skill routes
router.post("/user-skill-add/:userId", userSkillController.addUserSkill);
router.delete(
  "/user-skill-delete/:userId",
  userSkillController.deleteUserSkill
);
router.get("/user-skill-fetch/:userId", userSkillController.getUserSkills);

// User Event routes
router.post("/user-event-add/:userId", userEventController.addUserEvent);
router.get("/user-event-fetch/:userId", userEventController.getUserEvents);

// User Event Interest routes
router.post(
  "/user-event-interest/:userId",
  userEventInterestController.addUserEventInterest
);
router.get(
  "/user-event-interest-fetch/:userId",
  userEventInterestController.getUserEventInterests
);

router.post(
  "/registration-full-email",
  userEventInterestController.sendRegistrationFullMail
);

module.exports = router;
