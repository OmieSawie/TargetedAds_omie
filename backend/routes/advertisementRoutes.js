const express = require("express");
const router = express.Router();

const advertisementController = require("../controllers/advertisementController");
const { isAuthenticated, isAuthenticatedAsBusiness } = require("../controllers/authController");
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
      isAuthenticatedAsBusiness,
  advertisementController.createAdvertisement
);

router.delete(
  "/:advertisementIdId",
      isAuthenticatedAsBusiness,
  advertisementController.deleteAdvertisement
);

router.patch(
  "/:advertisementId",
        isAuthenticatedAsBusiness,
  advertisementController.updateAdvertisement
);

module.exports = router;
