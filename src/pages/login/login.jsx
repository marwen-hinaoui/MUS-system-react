import { useState } from "react";
import { Alert, Divider, Form, Input } from "antd";
import { Card, Flex } from "antd";
import styles from "./login.module.css";
import { login_api } from "../../api/login_api";
import { useNavigate } from "react-router";
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

const inputErrorMsg = {
  username: "Please input your Username!",
  password: "Please input your Password!",
};

const Login = () => {
  var navigate = useNavigate();
  const [response, setResponse] = useState();
  const isAuthenticated = useSelector((state) => state.app.isAuthenticated);

  //DISPATCH
  const dispatch = useDispatch();

  //SUBSCRIBE TO STORE
  const errroMsg = useSelector((state) => state.app.errorMsg);
  const loading = useSelector((state) => state.app.isLoading); //Loading testa3melha ken fl auth ----> arja3 lel user_slice

  //LOGIN ACTION
  const onFinish = async (form) => {
    dispatch(set_loading(true));
    const formData = {
      username: form.username,
      password: form.password,
    };
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
        dispatch(set_error(res.resError.message));
      }
    }
  };

  //ERROR MSG RENDER
  const errorHandleMsg = () => {
    if (errroMsg) {
      return (
        <Form.Item>
          <Alert
            style={{ fontSize: FONTSIZE.PRIMARY }}
            message={errroMsg}
            type="error"
            showIcon
             
          />
        </Form.Item>
      );
    }
  };

  return (
    // isAuthenticated === true && (
    <Flex align="center" justify="center" className={styles.container}>
      <img src={LearLogo} className={`${styles.logo} m-0`} alt="Lear Logo" />
      <Divider className="my-4">Make Up System</Divider>
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
            {errorHandleMsg()}

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
                placeholder="Password"
                name="password"
              />
            </Form.Item>

            <SharedButton
              color={COLORS.LearRed}
              margins={"mt-1"}
              width={"100%"}
              name={"LOGIN"}
              loading={loading}
            />
          </Form>
        </Flex>
      </Flex>
    </Flex>
  );
  // );
};

export default Login;
