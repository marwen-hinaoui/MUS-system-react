import apiInstance from "./axios";

export const update_massive_stock_api = async (dataQte, token) => {
  try {
    const res = await apiInstance.post(
      "stock/update/massive",
      { dataQte },
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
export const check_massive_stock_api = async (dataQte, token) => {
  try {
    const res = await apiInstance.post(
      "stock/check/massive",
      { dataQte },
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
