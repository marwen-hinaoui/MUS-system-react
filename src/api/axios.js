import axios from "axios";

const baseApiUrl = process.env.BASE_URL_API || "http://10.70.26.254:3000/api";
// const baseApiUrl = process.env.BASE_URL_API || "http://127.0.0.1:3000/api";

const apiInstance = axios.create({
  baseURL: baseApiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default apiInstance;
