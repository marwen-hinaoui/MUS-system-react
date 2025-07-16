import apiInstance from "./axios";

export const login_api = async (userData) => {
  try {
    const res = await apiInstance.post("/login", userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return { resData: res.data, resError: null };
  } catch (error) {
    return { resData: null, resError: error };
  }
};
