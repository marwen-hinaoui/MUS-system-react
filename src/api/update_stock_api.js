import apiInstance from "./axios";

export const update_stock_api = async (idStock, qteAjour, token) => {
  try {
    const res = await apiInstance.post(
      "stock/update",
      { idStock, qteAjour },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return { resData: res.data, resError: null };
  } catch (error) {
    return { resData: null, resError: error };
  }
};
