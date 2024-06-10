const express = require("express");
const router = express.Router();
const userController = require("../controller/userContoller");
const { isRoot, isSupervisor, isAuthenticated } = require("../Middleware/auth");

// Only root can create supervisor accounts and other accounts
router.post("/root", isAuthenticated, isRoot, userController.createUser);

// Supervisors can create technician accounts
router.post("/supervisor", isAuthenticated, isSupervisor, userController.createTech);

// Only root can view users
router.get("/", isAuthenticated, isRoot, userController.getUsers);

// Login
router.post("/login", userController.login);
module.exports = router;
