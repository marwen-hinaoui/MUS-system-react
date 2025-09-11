import apiInstance from "../axios";

export const get_seq_api = async (sequence, token) => {
  try {
    const res = await apiInstance.get(`cms/sequences/${sequence}`, {
      headers: {
        Authorization: `Bearer ${token}`,

        "Content-Type": "application/json",
      },
    });
    return { resData: res.data, resError: null };
  } catch (error) {
    return { resData: null, resError: error };
  }
};
