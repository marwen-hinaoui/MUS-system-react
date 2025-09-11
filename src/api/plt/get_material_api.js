import apiInstance from "../axios";

export const get_material_api = async (cover_pn, panel_number, token) => {
  try {
    const res = await apiInstance.get(
      `cms/material/${cover_pn}/${panel_number}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,

          "Content-Type": "application/json",
        },
      }
    );
    return { resData: res.data, resError: null };
  } catch (error) {
    return { resData: null, resError: error };
  }
};
