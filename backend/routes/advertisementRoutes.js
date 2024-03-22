const express = require("express");
const router = express.Router();

const advertisementController = require("../controllers/advertisementController");
const { isAuthenticated } = require("../controllers/authController");
const getAdvertisementSchema = require("../schemas/getAdvertisementSchema");

router.get(
  "/",
  isAuthenticated,
  advertisementController.getAllAdvertisements
);

router.get(
  "/:advertisementId",
    isAuthenticated,
  advertisementController.getOneAdvertisement
);

router.post(
  "/createAdvertisement",
      isAuthenticated,
  advertisementController.createAdvertisement
);

router.delete(
  "/:advertisementIdId",
      isAuthenticated,
  advertisementController.deleteAdvertisement
);

router.patch(
  "/:advertisementId",
        isAuthenticated,
  advertisementController.updateAdvertisement
);

module.exports = router;
