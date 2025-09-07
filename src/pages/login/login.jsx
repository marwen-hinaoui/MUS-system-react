import { useState } from "react";
import { Card, Divider, Form, Input, notification } from "antd";
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
import CardComponent from "../../components/card/cardComponent";

const inputErrorMsg = {
  username: "Veuillez saisir votre nom d'utilisateur!",
  password: "Veuillez saisir votre mot de passe!",
};

const Login = () => {
  var navigate = useNavigate();
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
      dispatch(set_role(res.resData.roleList));
      dispatch(set_token(res.resData.accessToken));
      dispatch(set_userId(res.resData.id));
      dispatch(
        set_fullname(`${res.resData.firstName} ${res.resData.lastName}`)
      );

      dispatch(set_authenticated(true));
    } else {
      if (
        res.resError.response.status === 404 ||
        res.resError.response.status === 401
      ) {
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
          padding: "0 0 14px 0",
          textAlign: "center",
        }}
      >
        <img src={LearLogo} className={`${styles.logo}`} alt="Lear Logo" />
      </div>

      <Flex
        style={{
          paddingTop: "14px",
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
                paddingTop: "14px",
                fontSize: FONTSIZE.PRIMARY,
                color: COLORS.BLACK,
                fontWeight: "500",
              }}
            >
              Make up area system
            </div>
          </Form>
        </Flex>
      </Flex>

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          fontSize: FONTSIZE.PRIMARY,
        }}
      >
        v1.0
      </div>
    </Flex>
  ) : (
    <>{redirection && <Navigate to={redirection} />}</>
  );
};

export default Login;
