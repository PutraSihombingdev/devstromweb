import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Layout, Affix } from "antd";
import Header from "./Header";
import Footer from "./Footer";


const { Header: AntHeader, Content } = Layout;

function MainLayout({ children }) {
  const [fixed, setFixed] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const handleFixedNavbar = (type) => setFixed(type);

  return (
    <Layout
      className={`layout-dashboard ${
        pathname.replace("/", "") === "profile" ? "layout-profile" : ""
      }`}
      style={{ minHeight: "100vh" }}
    >
      {/* Header */}
      {fixed ? (
        <Affix offsetTop={0}>
          <AntHeader className="ant-header-fixed">
            <Header handleFixedNavbar={handleFixedNavbar} />
          </AntHeader>
        </Affix>
      ) : (
        <AntHeader className={fixed ? "ant-header-fixed" : ""}>
          <Header handleFixedNavbar={handleFixedNavbar} />
        </AntHeader>
      )}

      {/* Content */}
      <Content style={{ padding: "24px" }}>
        {children}
      </Content>

      {/* Footer */}
      <Footer />
    </Layout>
  );
}

export default MainLayout;
