import apiInstance from "./axios";

export const assign_bin_project_api = async (
  project,
  startBin,
  endBin,
  token
) => {
  try {
    const res = await apiInstance.post(
      "bins/assign",
      { project, startBin, endBin },
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
