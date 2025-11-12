import apiInstance from "./axios";

export const get_bin_from_pattern_api = async (partNumber, _pattern, token) => {
  try {
    const res = await apiInstance.get(`bins/${partNumber}/${_pattern}`, {
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
