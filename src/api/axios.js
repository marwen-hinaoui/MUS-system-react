import axios from "axios";

const baseApiUrl =
  process.env.REACT_APP_HOST && process.env.REACT_APP_PORT
    ? `http://${process.env.REACT_APP_HOST.trim()}:${process.env.REACT_APP_PORT.trim()}/api`
    : "http://10.70.26.254:3000/api";

console.log(baseApiUrl);

const apiInstance = axios.create({
  baseURL: baseApiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default apiInstance;
