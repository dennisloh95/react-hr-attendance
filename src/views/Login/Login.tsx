import React, { useEffect } from "react";
import styles from "./Login.module.scss";
import { Button, message, Form, Input, Checkbox, Row, Col } from "antd";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store";
import type { RootState } from "../../store";
import { loginAction, updateToken } from "../../store/modules/users";
import { useNavigate } from "react-router-dom";

interface User {
  email: string;
  pass: string;
}

const testUsers: User[] = [
  {
    email: "huangrong@imooc.com",
    pass: "huangrong",
  },
  {
    email: "hongqigong@imooc.com",
    pass: "hongqigong",
  },
];

const Login = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const autoLogin = (values: User) => {
    return () => {
      form.setFieldsValue(values);
      onFinish(values);
    };
  };

  const onFinish = (values: User) => {
    dispatch(loginAction(values)).then((action) => {
      const { errcode, token } = (
        action.payload as { [index: string]: unknown }
      ).data as { [index: string]: unknown };
      if (errcode === 0 && typeof token === "string") {
        dispatch(updateToken(token));
        message.success("Login Successful");
        navigate("/");
      } else {
        message.error("Login Fail");
      }
    });
  };

  const onFinishFailed = ({ values }: { values: User }) => {
    console.log("Failed", values);
  };

  return (
    <div className={styles.login}>
      <div className={styles.header}>
        <span className={styles["header-title"]}>Attendance Management</span>
      </div>
      <div className={styles.desc}>React + TS Attendance Management</div>
      <Form
        name="basic"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className={styles.main}
        form={form}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please insert your email." },
            { type: "email", message: "Please insert valid email." },
          ]}
        >
          <Input placeholder="Insert Email" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="pass"
          rules={[{ required: true, message: "Please insert your password." }]}
        >
          <Input.Password placeholder="Insert Password" />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
      <div className={styles.users}>
        <Row gutter={20}>
          {testUsers.map(({ email, pass }) => (
            <Col key={email} span={12}>
              <h3>
                Tester Account:{" "}
                <Button onClick={autoLogin({ email, pass })}>
                  Click to Login
                </Button>
              </h3>
              <p>Email: {email}</p>
              <p>Password: {pass}</p>
            </Col>
          ))}
          <Col></Col>
        </Row>
      </div>
    </div>
  );
};

export default Login;
