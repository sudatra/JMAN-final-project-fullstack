const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const withAuthUser = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  jwt.verify(token, process.env.USER_JWT, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    } else {
      req.userId = decoded.userId;
      next();
    }
  });
};

const withAuthAdmin = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  jwt.verify(token, process.env.ADMIN_JWT, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    } else {
      req.adminId = decoded.adminId;
      next();
    }
  });
};

module.exports = {
  withAuthAdmin,
  withAuthUser,
};
