import axios from "axios";

const axiosInstanceFastApi = axios.create({
  baseURL: process.env.AI_SERVICE_UR,
  timeout: 60000,
  withCredentials: true

});

export default axiosInstanceFastApi;
