import axiosInstance from './axiosInstance';

const loginGoogleUser = async (code) => {
    await axiosInstance.post('/auth/google/login', { code },{timeout:10000});
};

export default loginGoogleUser;
