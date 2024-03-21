const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const editUserSchema = require("../schemas/editUserSchema");

router.get("/getUser/:userId", userController.getOneUser);

router.get("/allUsers", userController.getAllUser);

router.get("/me",  userController.getCurrentUser);

router.put("/me", editUserSchema, userController.putUserInfo);

router.patch(
  "/me",
  editUserSchema,
  userController.patchUserInfo
);

module.exports = router;
