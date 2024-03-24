import React from "react";
import { Typography, Chip, Grid, Paper } from "@mui/material";

const AdvertisementCard = ({ advertisement }) => {
  // Check if advertisement is undefined or null
  if (!advertisement) {
    return (
      <Typography variant="body1">
        Advertisement data is unavailable.
      </Typography>
    );
  }
  const { title, tags, description, imageUrl, businessName } = advertisement;

  return (
    <Paper elevation={3} style={{ padding: "20px", marginBottom: "20px" }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Business Name: {businessName}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" gutterBottom>
            Description: {description}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2" gutterBottom>
            Tags:
            {tags &&
              tags.map((tag, index) => (
                <Chip key={index} label={tag} style={{ marginRight: "5px" }} />
              ))}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <img src={imageUrl} alt={imageUrl} style={{ maxWidth: "100%" }} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AdvertisementCard;
