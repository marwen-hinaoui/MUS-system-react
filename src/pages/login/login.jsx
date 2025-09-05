import { useState } from "react";
import { Divider, Form, Input, notification } from "antd";
import { Flex } from "antd";
import styles from "./login.module.css";
import "./login.css";
import { login_api } from "../../api/login_api";
import { Navigate, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  set_authenticated,
  set_error,
  set_fullname,
  set_loading,
  set_redirection,
  set_role,
  set_token,
  set_userId,
} from "../../redux/slices";
import { AiOutlineUser } from "react-icons/ai";
import SharedButton from "../../components/button/button";
import LearLogo from "../../assets/img/LearLogo.png";
import { FONTSIZE } from "../../constant/FontSizes";
import { COLORS } from "../../constant/colors";
import { openNotification } from "../../components/notificationComponent/openNotification";
import { TbLockPassword } from "react-icons/tb";
import { MdOutlinePassword } from "react-icons/md";

const inputErrorMsg = {
  username: "Veuillez saisir votre nom d'utilisateur!",
  password: "Veuillez saisir votre mot de passe!",
};

const Login = () => {
  var navigate = useNavigate();
  const [response, setResponse] = useState();
  const [api, contextHolder] = notification.useNotification();
  const isAuthenticated = useSelector((state) => state.app.isAuthenticated);
  //DISPATCH
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.app.isLoading);
  //SUBSCRIBE TO STORE

  const redirection = useSelector((state) => state.app.redirection);

  //LOGIN ACTION
  const onFinish = async (form) => {
    dispatch(set_loading(true));
    const formData = {
      username: form.username,
      password: form.password,
    };

    const res = await login_api(formData);

    if (res.resData) {
      console.log(res.resData);

      navigate(res.resData.redirect, { replace: true });
      dispatch(set_redirection(res.resData.redirect));
      dispatch(set_role(res.resData.roleMUS));
      dispatch(set_token(res.resData.accessToken));
      dispatch(set_userId(res.resData.id));
      dispatch(
        set_fullname(`${res.resData.firstName} ${res.resData.lastName}`)
      );
      console.log(res.resData.firstName);
      console.log(res.resData.lastName);

      setResponse(res.resData);
      dispatch(set_authenticated(true));
    } else {
      if (res.resError.response) {
        console.log(res.resError);
        dispatch(set_error(res.resError.response.data.message));
        openNotification(api, res.resError.response.data.message);
      }
    }
    dispatch(set_loading(false));
  };

  return isAuthenticated === false ? (
    <Flex align="center" justify="center" className={styles.container}>
      {contextHolder}
      <div
        style={{
          padding: "17px",
        }}
      >
        <img src={LearLogo} className={`${styles.logo} m-0`} alt="Lear Logo" />
      </div>

      <Flex
        style={{
          padding: "14px",
        }}
      >
        <Flex style={{ width: "350px" }} align="center" justify="center">
          <Form
            name="basic"
            onFinish={onFinish}
            autoComplete="off"
            className={styles.formStyle}
          >
            <Form.Item
              style={{ fontSize: FONTSIZE.PRIMARY }}
              name="username"
              rules={[
                {
                  required: true,
                  message: inputErrorMsg.username,
                },
              ]}
            >
              <Input
                style={{
                  fontSize: FONTSIZE.PRIMARY,
                  borderRadius: "5px",
                  height: "34px",
                }}
                className="input p-2"
                prefix={
                  <AiOutlineUser style={{ fontSize: FONTSIZE.PRIMARY }} />
                }
                placeholder="Username"
                name="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: inputErrorMsg.password }]}
            >
              <Input.Password
                style={{
                  fontSize: FONTSIZE.PRIMARY,
                  borderRadius: "5px",
                  height: "34px",
                }}
                className="p-2"
                placeholder="Mot de passe"
                name="password"
                prefix={
                  <TbLockPassword style={{ fontSize: FONTSIZE.PRIMARY }} />
                }
                iconRender={() => (
                  <MdOutlinePassword style={{ fontSize: FONTSIZE.PRIMARY }} />
                )}
              />
            </Form.Item>

            <SharedButton
              color={COLORS.LearRed}
              fontSize={FONTSIZE.PRIMARY}
              width={"100%"}
              name={"Connexion"}
              padding={"17px 0"}
              loading={isLoading}
            />
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: "14px",
                color: COLORS.BLACK,
                padding: "14px 0 0 0",
              }}
            >
              Make Up Area System
            </div>
            {/* Bottom-right version */}
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                right: "20px",
                fontSize: "14px",
              }}
            >
              v1.0
            </div>
          </Form>
        </Flex>
      </Flex>
    </Flex>
  ) : (
    <>{redirection && <Navigate to={redirection} />}</>
  );
};

export default Login;
