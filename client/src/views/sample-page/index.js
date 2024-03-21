import React, { useState } from "react";
import {
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
  TextField,
  Chip,
} from "@mui/material";
import MainCard from "ui-component/cards/MainCard";

import axios from "axios";

const ImageUploadForm = () => {
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("image", selectedFile);
      formData.append("description", description);
      formData.append("tags", JSON.stringify(tags));

      console.log(formData.get("tags"));
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload successful:", response.data);
    } catch (error) {
      console.error("Error uploading image:", error);
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
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="image-upload"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="image-upload">
              <Button variant="contained" component="span">
                Choose File
              </Button>
            </label>
            {selectedFile && (
              <Typography
                variant="body1"
                gutterBottom
                style={{ marginTop: "8px" }}
              >
                Selected File: {selectedFile.name}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "300px",
                  marginTop: "8px",
                }}
              />
            )}
          </Grid>
          <Grid item xs={12}>
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
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={!selectedFile || isLoading}
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
