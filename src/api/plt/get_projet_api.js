import apiInstance from "../axios";

export const get_projet_api = async (cover_pn, token) => {
  try {
    const res = await apiInstance.get(`cms/projet/${cover_pn}`, {
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
