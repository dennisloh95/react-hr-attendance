import { Layout } from "antd";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import HomeAside from "./components/HomeAside";
import HomeBreadcrumb from "./components/HomeBreadcrumb";
import HomeHeader from "./components/HomeHeader";
import HomeMain from "./components/HomeMain";
import styles from "./Home.module.scss";

const { Header, Content, Sider } = Layout;

const Home = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout>
      <Header className="header">
        <HomeHeader />
      </Header>
      <Layout>
        <Sider
          width={300}
          theme="light"
          collapsible
          collapsed={collapsed}
          onCollapse={(v) => setCollapsed(v)}
        >
          <HomeAside />
        </Sider>
        <Layout style={{ padding: "20px" }}>
          <HomeBreadcrumb />
          <Content className={styles["home-main"]}>
            <HomeMain />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Home;
