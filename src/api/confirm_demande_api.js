import apiInstance from "./axios";

export const confirm_demande_api = async (demande, token) => {
  try {
    const res = await apiInstance.post("demande/comfirm", demande, {
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
