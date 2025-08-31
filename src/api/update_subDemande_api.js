import apiInstance from "./axios";

export const update_subDemande_api = async (
  idSubdemande,
  id,
  quantite,
  token
) => {
  try {
    const res = await apiInstance.post(
      "demande/sub/update/" + id,
      {
        idSubdemande,
        quantite,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    console.log("====================================");
    console.log(idSubdemande, id, quantite);
    console.log("====================================");
    return { resData: res.data, resError: null };
  } catch (error) {
    return { resData: null, resError: error };
  }
};
