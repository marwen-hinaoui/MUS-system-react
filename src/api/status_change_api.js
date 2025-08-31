import apiInstance from "./axios";

export const status_change_api = async (id, token) => {
  try {
    const res = await apiInstance.post(
      "demande/status/change/" + id,
      {},
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
