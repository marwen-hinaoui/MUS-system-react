import { useState } from "react";
import { App, Divider, Form, Input, message, notification, Spin } from "antd";
import { Alert, Card, Flex } from "antd";
import styles from "./login.module.css";
import "./login.css";
import { login_api } from "../../api/login_api";
import { Link, Navigate, redirect, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  set_authenticated,
  set_error,
  set_fullname,
  set_loading,
  set_redirection,
  set_role,
  set_token,
} from "../../redux/slices";
import { AiOutlineLock, AiOutlineMail, AiOutlineUser } from "react-icons/ai";
import SharedButton from "../../components/button/button";
import LearLogo from "../../assets/img/LearLogo.png";
import { FONTSIZE } from "../../constant/FontSizes";
import { COLORS } from "../../constant/colors";
import { openNotification } from "../../components/notificationComponent/openNotification";

import SpinComponent from "../../components/spinComponent/spinComponent";

const inputErrorMsg = {
  username: "Veuillez saisir votre nom d'utilisateur!",
  password: "Veuillez saisir votre mot de passe!",
};

const Login = () => {
  var navigate = useNavigate();
  const [response, setResponse] = useState();
  const [fullName, setFullName] = useState();
  const [api, contextHolder] = notification.useNotification();
  const isAuthenticated = useSelector((state) => state.app.isAuthenticated);
  const { message } = App.useApp();

  //DISPATCH
  const dispatch = useDispatch();

  //SUBSCRIBE TO STORE

  const loading = useSelector((state) => state.app.isLoading); //Loading testa3melha ken fl auth ----> arja3 lel user_slice
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
      setFullName(`${res.resData.firstName} ${res.resData.lastName}`);
      navigate(res.resData.redirect, { replace: true });
      dispatch(set_redirection(res.resData.redirect));
      dispatch(set_role(res.resData.roleMUS));
      dispatch(set_token(res.resData.accessToken));
      dispatch(set_fullname(fullName));
      setResponse(res.resData);
      dispatch(set_authenticated(true));
    } else {
      if (res.resError.response) {
        console.log(res.resError);
        dispatch(set_error(res.resError.response.data.message));
        openNotification(api, res.resError.response.data.message);
      }
      // else {
      //   // errorAlert(res.resError.message);
      //   openNotification(api, res.resError.response.data.message);
      // }
    }
    dispatch(set_loading(false));
  };

  return isAuthenticated === false ? (
    <Flex align="center" justify="center" className={styles.container}>
      {contextHolder}
      <img src={LearLogo} className={`${styles.logo} m-0`} alt="Lear Logo" />

      <div
        style={{
          width: "200px",
        }}
      >

              {/* <p className="text-center fw-5">Make Up Area System</p> */}
        <Divider />
      </div>

      <Flex>
        <Flex style={{ width: "350px" }} align="center" justify="center">
          <Form
            name="basic"
            variant="filled"
            initialValues={{ variant: "filled" }}
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
                style={{ fontSize: FONTSIZE.PRIMARY }}
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
                style={{ fontSize: FONTSIZE.PRIMARY }}
                className="p-2"
                prefix={
                  <AiOutlineLock style={{ fontSize: FONTSIZE.PRIMARY }} />
                }
                placeholder="Mot de passe"
                name="password"
              />
            </Form.Item>

            <SharedButton
              color={COLORS.LearRed}
              margins={"mt-1"}
              width={"100%"}
              name={"Connexion"}
              // loading={loading}
            />
            {/* <div className="w-100 text-end mt-2">
                <Link
                  style={{
                    fontSize: FONTSIZE.PRIMARY,
                    textDecoration: "none",
                    color: COLORS.BLACK,
                  }}
                >
                  <div>Voir les demandes <FaArrowRight  /></div>
                </Link>
              </div> */}
          </Form>
        </Flex>
      </Flex>
    </Flex>
  ) : (
    <>{!redirection ? <SpinComponent /> : <Navigate to={redirection} />}</>
  );
};

export default Login;
