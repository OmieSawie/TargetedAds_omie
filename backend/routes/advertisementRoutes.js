const express = require("express");
const router = express.Router();

const advertisementController = require("../controllers/advertisementController");
const getAdvertisementSchema = require("../schemas/getAdvertisementSchema");

router.get(
  "/",
  advertisementController.getAllAdvertisements
);

router.get(
  "/:advertisementId",
  advertisementController.getOneAdvertisement
);

router.post(
  "/createAdvertisement",
  advertisementController.createAdvertisement
);

router.delete(
  "/:advertisementIdId",
  advertisementController.deleteAdvertisement
);

router.patch(
  "/:advertisementId",
  advertisementController.updateAdvertisement
);

module.exports = router;
