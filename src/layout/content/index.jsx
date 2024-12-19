/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2023-02-07 19:08:16
 * @LastEditors: chenhua
 * @LastEditTime: 2023-03-01 18:13:05
 */
// import { Layout, Menu } from "antd";
import routers from "@/routers";
import _ from "lodash";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

/**
 * 渲染底层路由
 * @param route
 * @returns {JSX.Element}
 */
const renderRoute = (route) => (
  <Route
    key={route.path}
    exact
    path={route.path}
    element={<div style={{ boxSizing: "border-box" }}>{route.element}</div>}
  />
);
function ContainerMain() {
  /**
   * 渲染次级路由
   * @param routes
   */
  const renderRoutes = (routes) =>
    routes.map((r) => {
      if (!_.isEmpty(r.children)) {
        return renderRoutes(r.children);
      } else {
        return renderRoute(r);
      }
    });
  return (
    <>
      <Routes>{renderRoutes(routers)}</Routes>
      {/* 提供一切部署服务端应用基础设施，可根据自己的语言偏好编写代码，搭配 DevOps
      工作流高效构建和部署。无需运维管理，将你从各种基础架构工作中解放出来。提供一切部署服务端应用基础设施，可根据自己的语言偏好编写代码，搭配
      DevOps
      工作流高效构建和部署。无需运维管理，将你从各种基础架构工作中解放出来。提供一切部署服务端应用基础设施，可根据自己的语言偏好编写代码，搭配
      DevOps
      工作流高效构建和部署。无需运维管理，将你从各种基础架构工作中解放出来。提供一切部署服务端应用基础设施，可根据自己的语言偏好编写代码，搭配
      DevOps
      工作流高效构建和部署。无需运维管理，将你从各种基础架构工作中解放出来。提供一切部署服务端应用基础设施，可根据自己的语言偏好编写代码，搭配
      DevOps
      工作流高效构建和部署。无需运维管理，将你从各种基础架构工作中解放出来。 */}
    </>
  );
}
export default ContainerMain;
