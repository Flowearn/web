/*
 * @description: 整体布局
 * @author: chenhua
 * @Date: 2023-02-03 14:17:45
 * @LastEditors: chenhua
 * @LastEditTime: 2024-08-02 11:41:21
 */
import { Layout } from "antd";
import SideBar from "./navbar/sideBar";
import HeaderBar from "./header";
// import FooterBar from "./footer";
import ContainerMain from "./content";
import "./index.scss";

const { Content } = Layout;
function LayoutContainer() {
  return (
    <>
      <div className="Layout">
        <HeaderBar />
        <Layout style={{ background: "#404D4C" }}>
          <SideBar />
          <Layout className="site-layout">
            <Content>
              {/* <HeaderBar /> */}
              <ContainerMain />
            </Content>
          </Layout>
        </Layout>
      </div>
    </>
  );
}

export default LayoutContainer;
