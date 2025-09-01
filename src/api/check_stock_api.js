import apiInstance from "./axios";

export const check_stock_api = async (partNumber, patternNumb, token) => {
  try {
    const res = await apiInstance.post(
      "stock/check",
      { partNumber, patternNumb },
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
