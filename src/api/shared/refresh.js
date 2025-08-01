import apiInstance from "../axios";
import { useLocation, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import {
  clear_auth,
  set_token,
  set_authenticated,
  set_redirection,
  set_role,
  set_fullname,
} from "../../redux/slices";

export const useRefreshAccessToken = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const refreshToken = async () => {
    try {
      const res = await apiInstance.post("/auth/ref", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200) {
        console.log(res);
        
        dispatch(set_authenticated(true));
        dispatch(set_token(res.data.accessToken));
        dispatch(set_role(res.data.roleMUS));
        dispatch(set_redirection(res.data.redirection));
        dispatch(set_fullname(`${res.data.firstName} ${res.data.lastName}`));
        

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
