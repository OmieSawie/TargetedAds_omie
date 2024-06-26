const express = require("express");
const authController = require("../controllers/authController");
const googleLoginSchema = require("../schemas/googleLoginSchema");
const router = express.Router();

router.get("/statusAsBusiness", authController.isAuthenticatedAsBusiness, (req, res) => {
  res.sendStatus(204);
});

// router.get("/status", authController.isAuthenticated, (req, res) => {
//   res.sendStatus(204);
// });

router.get("/status",authController.getUser)

router.get("/google/redirect", authController.googleRedirect);

router.post("/google/login", googleLoginSchema, authController.googleLogin);

router.post("/logout", authController.logout);

module.exports = router;
