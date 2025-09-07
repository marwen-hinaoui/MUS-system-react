import apiInstance from "./axios";

export const get_fonctions_api = async () => {
  try {
    const res = await apiInstance.get("trim/fonction", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return { resData: res.data, resError: null };
  } catch (error) {
    return { resData: null, resError: error };
  }
};
