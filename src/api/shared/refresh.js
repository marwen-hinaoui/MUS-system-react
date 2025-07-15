import apiInstance from "../axios";
import { useLocation, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import {
  clear_auth,
  set_token,
  set_authenticated,
  set_redirection,
} from "../../redux/slices";

export const useRefreshAccessToken = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const refreshToken = async () => {
    try {
      const res = await apiInstance.post("/ref", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200) {
        dispatch(set_authenticated(true));
        dispatch(set_token(res.data.access));

        if (location.pathname == "/" || location.pathname == "/")
          navigate(res.data.redirection);
        else dispatch(set_redirection(location.pathname), { replace: true });
      }
    } catch (error) {
      if (error.status === 400 || error.status === 401) {
        dispatch(clear_auth());
        dispatch(set_authenticated(false));
        navigate("/", { replace: true });
      }
    }
  };

  return refreshToken;
};
