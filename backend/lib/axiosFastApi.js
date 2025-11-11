import axios from "axios";

const axiosInstanceFastApi = axios.create({
  baseURL: "http://localhost:5001",
  timeout: 60000,
  withCredentials: true

});

export default axiosInstanceFastApi;
