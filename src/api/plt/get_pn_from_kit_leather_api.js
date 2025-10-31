import apiInstance from "../axios";

export const get_pn_from_kit_leather_api = async (kit_leather_pn, token) => {
  try {
    const res = await apiInstance.get(`cms/pn/${kit_leather_pn}`, {
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
