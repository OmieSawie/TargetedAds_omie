import axiosInstance from "./axiosInstance";

const fetchAdvertisements = async () => {
  try {
    const response = await axiosInstance.get("/advertisements/"); // Assuming your backend endpoint is '/api/advertisements'
    console.log(response.data.advertisementFilter);
    return response.data.advertisementFilter; // Assuming the data returned is an array of advertisements
  } catch (error) {
    console.error("Error fetching advertisements:", error);
    return []; // Return an empty array in case of error
  }
};

export default fetchAdvertisements;
