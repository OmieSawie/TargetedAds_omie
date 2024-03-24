const { validationResult } = require("express-validator");

const advertisementModel = require("../models/advertisementModel");
const userModel = require("../models/userModel");

const getAllAdvertisements = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  if (req.session.credentials) {
    // Try to find the user among the registered users
    req.user = await userModel.findOne({ emailId: req.session.user.emailId }).exec();
    req.session.user = req.user;
    await req.session.save();
    if (req.user.role == "business") {
      // Filter advertisements as per email of business user
      emailId = req.user.emailId;
      console.log("emailId",emailId)
      advertisementModel.find({businessName:emailId}).then((advertisementFilter)=>{
      console.log("advertisements ",advertisementFilter);
      res.status(200).json({ advertisementFilter });
      })
    } else {
      // Return advertisemts by filtering as per tags
      tagsReq = req.user.tags;
      advertisementModel.find({tags:{$in:tagsReq}}).then((advertisementFilter)=>{
        console.log("advertisements ",advertisementFilter);
        res.status(200).json({ advertisementFilter });
      }).catch((error)=>{
        console.error('Error fetching advertisements:', error);
        res.status(500).json({ error: 'Internal server error' });
      } );
    }
  } else {
    // Return 401 Unauthorized if user is not authenticated
    res.status(401).json({ errors: "User is not authenticated" });
  }
};

const getOneAdvertisement = async (req, res) => {
  try {
    const advertisements = await advertisementModel.findById(
      req.params.advertisementId,
    );
    res.status(200).json(advertisements);
  } catch (err) {
    res.status(500).send("Error in advertisement" + err);
  }
};

const sendAdvertisementRequest = async (advertisement, res, user = null) => {
  try {
    const advertisementRequest = await advertisementModel.create(advertisement);
    const advertisingUser = await userModel.findById(user._id);
    advertisingUser.advertisements.unshift(advertisementRequest);
    advertisingUser.save();

    if (advertisingUser.role === "superAdmin") {
      for (let superAdmin in bookRequest.approvedBy)
        bookRequest.approvedBy[superAdmin] = "accepted";
      bookRequest.save();
    }
    res.status(200).json(bookRequest);
  } catch (err) {
    res.status(500).send(err);
  }
};

const createAdvertisement = async (req, res) => {
  console.log("req reached controller", req.body);
  const { title, description, imageUrl } = req.body;
  const tags = JSON.parse(req.body.tags);
  // console.log("req session user", req.session);
  // const businessName = req.session.session;
  const businessName = req.session.user.emailId || "Test@mail.com";
  const newAdvertisement = new advertisementModel({
    title,
    tags,
    description,
    imageUrl,
    businessName,
  });
  console.log("Advertisement is: ", newAdvertisement);

  try {
    // Save the newImage document to MongoDB
    await newAdvertisement.save();
    console.log("Image uploaded successfully:", newAdvertisement);
    res.status(200).json({ message: "Upload successful" });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Error uploading image" });
  }
};

const deleteAdvertisement = async (req, res) => {
  try {
    await advertisementModel.findByIdAndRemove(req.params.advertisementId);
    res.status(200).send("Advertisement deleted successfully");
  } catch (err) {
    res.status(500).send(err);
  }
};

const updateAdvertisement = async (req, res) => {
  try {
    const updatedTitle = req.body.title;
    const updatedTags = req.body.tags;
    const updatedFile = req.body.file;
    const updatedDescription = req.body.description;
    const result = await advertisementModel.findByIdAndUpdate(
      req.params.advertisementId,
      {
        $set: {
          title: req.body.title,
          tags: req.body.tags,
          file: req.body.file,
          description: req.body.description,
        },
      },
      { new: true },
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  getAllAdvertisements,
  createAdvertisement,
  getOneAdvertisement,
  deleteAdvertisement,
  updateAdvertisement,
};
