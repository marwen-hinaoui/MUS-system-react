import apiInstance from "./axios";

export const get_bin_from_projet_api = async (
  project,
  bin_code,
  id_user,
  token
) => {
  try {
    const res = await apiInstance.get(
      `bins/${project}/not/${bin_code}/${id_user}`,
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
