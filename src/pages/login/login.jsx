import { useState } from "react";
import { App, Divider, Form, Input, message, notification } from "antd";
import { Alert, Card, Flex } from "antd";
import styles from "./login.module.css";
import { login_api } from "../../api/login_api";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  set_authenticated,
  set_error,
  set_loading,
  set_redirection,
  set_token,
} from "../../redux/slices";
import { AiOutlineLock, AiOutlineMail, AiOutlineUser } from "react-icons/ai";
import SharedButton from "../../components/button/button";
import LearLogo from "../../assets/img/LearLogo.png";
import { FONTSIZE } from "../../constant/FontSizes";
import { COLORS } from "../../constant/colors";
import { openNotification } from "../../components/notificationComponent/openNotification";
import { FaArrowRight } from "react-icons/fa";

const inputErrorMsg = {
  username: "Veuillez saisir votre nom d'utilisateur!",
  password: "Veuillez saisir votre mot de passe!",
};

const Login = () => {
  var navigate = useNavigate();
  const [response, setResponse] = useState();
  const [api, contextHolder] = notification.useNotification();

  const isAuthenticated = useSelector((state) => state.app.isAuthenticated);
  const { message } = App.useApp();

  //DISPATCH
  const dispatch = useDispatch();

  //SUBSCRIBE TO STORE

  const loading = useSelector((state) => state.app.isLoading); //Loading testa3melha ken fl auth ----> arja3 lel user_slice

  const errorAlert = (msg) => {
    message.open({
      type: "error",
      content: msg,
      duration: 3,
    });
  };

  //LOGIN ACTION
  const onFinish = async (form) => {
    dispatch(set_loading(true));
    const formData = {
      username: form.username,
      password: form.password,
    };
    console.log(formData);

    const res = await login_api(formData);

    if (res.resData) {
      dispatch(set_token(res.resData.access));
      dispatch(set_redirection(res.resData.redirect));
      navigate(res.resData.redirect, { replace: true });
      setResponse(res.resData);
      dispatch(set_authenticated(true));
    } else {
      if (res.resError.response) {
        dispatch(set_error(res.resError.response.data.error));
      } else {
        dispatch(set_loading(false));
        // errorAlert(res.resError.message);
        openNotification(api, res.resError.message);
      }
    }
  };

  return (
    !isAuthenticated === true && (
      <Flex align="center" justify="center" className={styles.container}>
        {contextHolder}
        <img src={LearLogo} className={`${styles.logo} m-0`} alt="Lear Logo" />

        <div style={{
          width:'200px'
          }}>
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
                loading={loading}
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
    )
  );
};

export default Login;
