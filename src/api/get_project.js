import apiInstance from "./axios";

export const get_project = async () => {
  try {
    const res = await apiInstance.get("trim/projects", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return { resData: res.data, resError: null };
  } catch (error) {
    return { resData: null, resError: error };
  }
};
