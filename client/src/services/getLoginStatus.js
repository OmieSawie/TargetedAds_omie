import axiosInstance from "./axiosInstance";

const getLoginStatus = async () => {
  const result = await axiosInstance.get("/auth/status");
  return result;
};

export default getLoginStatus;
