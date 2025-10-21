import apiInstance from "./axios";

export const get_projet_api = async () => {
  try {
    const res = await apiInstance.get("trim/projets", {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return { resData: res.data, resError: null };
  } catch (error) {
    return { resData: null, resError: error };
  }
};
