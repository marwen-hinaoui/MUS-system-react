import apiInstance from "./axios";

export const change_status_gamme_api = async (data, token) => {
  try {
    const res = await apiInstance.post("rebuild/change", data, {
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
