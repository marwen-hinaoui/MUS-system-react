import apiInstance from "./axios";

export const ajout_stock_admin_leather_api = async (piece, token) => {
  try {
    const res = await apiInstance.post("stock/ajout/admin/kit", piece, {
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
