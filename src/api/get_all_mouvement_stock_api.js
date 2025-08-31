import apiInstance from "./axios";

export const get_all_mouvement_stock_api = async (token) => {
  try {
    const res = await apiInstance.get("stock/mouvement/all", {
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
