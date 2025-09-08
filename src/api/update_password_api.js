import axios from "axios";
import apiInstance from "./axios";

export const update_password_api = async (userId, newPassword, token) => {
  try {
    const res = await apiInstance.put(
      "auth/update-password",
      { userId, newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { resData: res.data, resError: null };
  } catch (error) {
    return { resData: null, resError: error };
  }
};
