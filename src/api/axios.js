import axios from "axios";

const baseApiUrl =
"http://127.0.0.1:3000/api";


console.log(baseApiUrl);

const apiInstance = axios.create({
  baseURL: baseApiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default apiInstance;