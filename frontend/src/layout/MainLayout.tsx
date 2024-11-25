import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();

  return (
    <Layout>
      {/* Sidebar */}
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div
          className="demo-logo-vertical"
          style={{ color: "white", padding: 16 }}
        >
          {collapsed ? "App" : "App Logo"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "users",
              icon: <UserOutlined />,
              label: "Users",
              onClick: () => navigate("/users"),
            },
            {
              key: "roles",
              icon: <VideoCameraOutlined />,
              label: "Roles",
              onClick: () => navigate("/roles"),
            },
            {
              key: "teams",
              icon: <UploadOutlined />,
              label: "Teams",
              onClick: () => navigate("/teams"),
            },
            {
              key: "Leads",
              icon: <PaperClipOutlined />,
              label: "Leads",
              onClick: () => navigate("/leads"),
            },
          ]}
        />
      </Sider>

      {/* Main Layout */}
      <Layout>
        {/* Header */}
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>

        {/* Content */}
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            backgroundColor: "white",
            boxShadow: "5px 5px 5px 5px",
          }}
        >
          <Outlet /> {/* Renders nested routes here */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
