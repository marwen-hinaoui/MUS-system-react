import apiInstance from "./axios";

export const delete_user_api = async (userId, token) => {
  try {
    const res = await apiInstance.post(`delete/${userId}`, demande, {
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
