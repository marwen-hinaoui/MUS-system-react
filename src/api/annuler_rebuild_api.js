import apiInstance from "./axios";

export const annuler_rebuild_api = async (id, token) => {
  try {
    const res = await apiInstance.delete(`rebuild/annuler/${id}`, {
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
