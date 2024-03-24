import React, { useState } from "react";
import {
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
  TextField,
  Chip,
  Alert,
} from "@mui/material";
import MainCard from "ui-component/cards/MainCard";

import axiosInstance from "../../services/axiosInstance";

const ImageUploadForm = () => {
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // State for image URL input
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  // Handle change for image URL input
  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
  };

  const handleUpload = async () => {
    setIsLoading(true);
    console.log(title, description);
    try {
      const formData = new URLSearchParams();
      formData.append("title", title);
      formData.append("imageUrl", imageUrl); // Append image URL to formData
      formData.append("description", description);
      formData.append("tags", JSON.stringify(tags));
      console.log("Sending form data ", formData.get("title"));

      const response = await axiosInstance.post(
        "/advertisements/createAdvertisement",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );
      console.log("Upload successful:", response.data);
      setSuccessMessage("Upload successful");
    } catch (error) {
      console.error(" Error uploading image:", error);
      setError(
        "User must be registered as a business to submit an Advertisement",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleTagsChange = (e) => {
    setNewTag(e.target.value);
  };

  const handleAddTag = () => {
    if (newTag.trim() !== "" && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleDeleteTag = (tagToDelete) => () => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToDelete));
  };

  return (
    <MainCard>
      <Container maxWidth="md">
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Upload an Image or a GIF
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="title"
              label="Title"
              fullWidth
              value={title}
              onChange={handleTitleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="imageUrl"
              label="Image URL"
              fullWidth
              value={imageUrl}
              onChange={handleImageUrlChange} // Call handleImageUrlChange on change
              variant="outlined"
            />
          </Grid>
          {/* Tags input */}
          <Grid item xs={12}>
            <TextField
              id="tags"
              label="Tags"
              fullWidth
              value={newTag}
              onChange={handleTagsChange}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddTag();
                }
              }}
              variant="outlined"
            />
            <Button
              variant="contained"
              onClick={handleAddTag}
              style={{ marginTop: "10px" }}
            >
              Add Tag
            </Button>
          </Grid>
          {/* Display added tags */}
          <Grid item xs={12}>
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                onDelete={handleDeleteTag(tag)}
                style={{
                  marginRight: "8px",
                  marginBottom: "8px",
                  marginTop: "0px",
                }}
              />
            ))}
          </Grid>
          <Grid item xs={12}>
            {/* Description input */}
            <TextField
              id="description"
              label="Description"
              multiline
              rows={4}
              fullWidth
              value={description}
              onChange={handleDescriptionChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            {/* Error and success messages */}
            {error && <Alert severity="error">{error}</Alert>}
            {successMessage && (
              <Alert severity="success">{successMessage}</Alert>
            )}
            {/* Upload button */}
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={!imageUrl || isLoading} // Disable if imageUrl is empty or loading
            >
              {isLoading ? <CircularProgress size={24} /> : "Upload"}
            </Button>
          </Grid>
        </Grid>
      </Container>
    </MainCard>
  );
};

export default ImageUploadForm;
