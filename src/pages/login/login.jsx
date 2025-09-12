import { Card, Form, Input, notification, Typography, Divider } from "antd";
import { Flex } from "antd";
import { AiOutlineUser } from "react-icons/ai";
import { TbLockPassword } from "react-icons/tb";
import { MdOutlinePassword } from "react-icons/md";
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
import { login_api } from "../../api/login_api";
import SharedButton from "../../components/button/button";
import LearLogo from "../../assets/img/LearLogo.png";
import { FONTSIZE } from "../../constant/FontSizes";
import { COLORS } from "../../constant/colors";
import { openNotification } from "../../components/notificationComponent/openNotification";
import styles from "./login.module.css";
import "./login.css";

const { Title, Text } = Typography;

const inputErrorMsg = {
  username: "Veuillez saisir votre nom d'utilisateur!",
  password: "Veuillez saisir votre mot de passe!",
};

const Login = () => {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

  const isAuthenticated = useSelector((state) => state.app.isAuthenticated);
  const isLoading = useSelector((state) => state.app.isLoading);
  const redirection = useSelector((state) => state.app.redirection);

  const dispatch = useDispatch();

  // LOGIN ACTION
  const onFinish = async (form) => {
    dispatch(set_loading(true));
    const formData = { username: form.username, password: form.password };

    const res = await login_api(formData);

    if (res.resData) {
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
        res.resError?.response?.status === 404 ||
        res.resError?.response?.status === 401
      ) {
        dispatch(set_error(res.resError.response.data.message));
        openNotification(api, res.resError.response.data.message);
      }
    }
    dispatch(set_loading(false));
  };

  return isAuthenticated === false ? (
    <main
      className={styles.container}
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f6fa, #ffffff)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      {contextHolder}

      <Card
        bordered={false}
        style={{
          width: 380,
          borderRadius: "12px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
          padding: "24px",
          background: "#fff",
        }}
      >
        {/* Header */}
        <header style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src={LearLogo}
            alt="Lear Logo"
            style={{ width: "120px", marginBottom: "10px" }}
          />
          <Title level={4} style={{ marginBottom: "4px", fontWeight: "600" }}>
            Make Up Area System
          </Title>
          <Text type="secondary" style={{ fontSize: "13px" }}>
            Connexion à votre compte
          </Text>
        </header>

        {/* Login Form */}
        <section>
          <Form
            name="loginForm"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: inputErrorMsg.username }]}
            >
              <Input
                size="large"
                prefix={
                  <AiOutlineUser style={{ fontSize: 18, color: "#999" }} />
                }
                placeholder="Nom d'utilisateur"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: inputErrorMsg.password }]}
            >
              <Input.Password
                size="large"
                prefix={
                  <TbLockPassword style={{ fontSize: 18, color: "#999" }} />
                }
                placeholder="Mot de passe"
                iconRender={() => (
                  <MdOutlinePassword style={{ fontSize: 18, color: "#999" }} />
                )}
              />
            </Form.Item>

            <SharedButton
              color={COLORS.LearRed}
              fontSize={FONTSIZE.PRIMARY}
              width={"100%"}
              name={"Connexion"}
              padding={"14px 0"}
              loading={isLoading}
            />
          </Form>
        </section>

        <Divider />

        {/* Footer */}
        <footer>
          <Flex align="center" justify="space-between">
            <Text strong style={{ fontSize: "12px" }}>
              Lear Trim Bizerte
            </Text>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              v1.0
            </Text>
          </Flex>
        </footer>
      </Card>
    </main>
  ) : (
    <>{redirection && <Navigate to={redirection} />}</>
  );
};

export default Login;
