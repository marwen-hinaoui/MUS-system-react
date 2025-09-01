import apiInstance from "./axios";

export const gestion_user_api = async (values, token) => {
  try {
    const res = await apiInstance.post("auth/signUp", values, {
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
