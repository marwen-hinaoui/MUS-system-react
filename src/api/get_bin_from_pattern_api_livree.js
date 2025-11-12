import apiInstance from "./axios";

export const get_bin_from_pattern_api_livree = async (
  partNumber,
  _pattern,
  token
) => {
  try {
    const res = await apiInstance.get(`bins/livree/${partNumber}/${_pattern}`, {
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
