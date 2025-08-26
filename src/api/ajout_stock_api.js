import apiInstance from "./axios";

export const ajout_stock_api = async (piece, token) => {
  try {
    const res = await apiInstance.post("stock/ajout", piece, {
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
