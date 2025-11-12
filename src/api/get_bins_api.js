import apiInstance from "./axios";

export const get_bins_api = async (token) => {
  try {
    const res = await apiInstance.get("bins", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return { resData: res.data, resError: null };
  } catch (error) {
    return { resData: null, resError: error };
  }
};
