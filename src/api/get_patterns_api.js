import apiInstance from "./axios";

export const get_patterns_api = async (partNumber, token) => {
  try {
    const res = await apiInstance.post(
      "stock/patterns",
      { partNumber },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return { resData: res.data, resError: null };
  } catch (error) {
    return { resData: null, resError: error };
  }
};
