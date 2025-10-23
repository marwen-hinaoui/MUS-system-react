import apiInstance from "../axios";

export const pattern_image_api = async (patternPN) => {
  try {
    const res = await apiInstance.get(`cms/image/${patternPN}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return { resData: res.data, resError: null };
  } catch (error) {
    return { resData: null, resError: error };
  }
};
