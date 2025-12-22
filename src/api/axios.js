import axios from "axios";

const baseApiUrl = "http://tnbzt-sql01:3000/api";

console.log(baseApiUrl);

const apiInstance = axios.create({
  baseURL: baseApiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default apiInstance;
