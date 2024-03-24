import axiosInstance from "./axiosInstance";

const getLoginStatus = async () => {
  await axiosInstance.get("/auth/statusAsBusiness");
};

export default getLoginStatus;
