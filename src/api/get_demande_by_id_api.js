import apiInstance from "./axios";

export const get_demande_by_id_api = async (id) => {
  try {
    const res = await apiInstance.get(`details/${id}`, {
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
