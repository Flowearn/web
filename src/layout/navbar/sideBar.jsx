/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2023-02-07 19:08:16
 * @LastEditors: chenhua
 * @LastEditTime: 2024-08-21 16:22:26
 */
import { Layout, Menu, Divider } from "antd";
import { useState } from "react";
import {
  FileOutlined,
  PieChartOutlined,
  UserOutlined,
  DesktopOutlined,
  TeamOutlined,
  TwitterOutlined,
  CodepenCircleOutlined,
  XOutlined,
} from "@ant-design/icons";
import routers from "../../routers";
import _, { head } from "lodash";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addRouter } from "@/redux/actions/routerAction";
import home_icon_x from "@/statics/images/home_icon_x.png";
import discord from "@/statics/images/discord.png";
import logo from "@/statics/images/logo1.svg";
import "./index.scss";
const { Sider } = Layout;

function SideBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);

  /**
   * 渲染菜单item
   * @param label
   * @param key
   * @param icon
   * @param children
   * @returns {{children, icon, label, key}}
   */
  const getItem = (label, key, icon, children) => {
    return {
      key,
      icon,
      children,
      label,
    };
  };

  /**
   * 获取菜单配置的items
   */
  const getItems = (list) => {
    if (_.isEmpty(list)) {
      return [];
    }
    return _.map(
      _.filter(_.cloneDeep(list), (o) => o.isTrue), //筛选需要显示在导航栏的路由
      (item) => {
        if (!_.isEmpty(item.children)) {
          item.children = getItems(item.children);
        }
        item = getItem(item.label, item.path, item.icon, item.children);
        return _.cloneDeep(item);
      }
    );
  };

  /**
   * 1、点击最底层菜单栏
   * @param item
   * @param key
   * @param keyPath
   * @param selectedKeys
   * @param domEvent
   */
  const onSelect = ({ item, key, keyPath, selectedKeys, domEvent }) => {
    navigate(key);
    localStorage.setItem("selectedKey", key);
    // let realPath = key || location?.pathname;
    // let payload = getItemByPath(routers, realPath);
    // console.log(key, 'key--------------------------', location)
    // dispatch(addRouter(payload));
  };

  /**
   * 根据path获取 routers 数据源的某个route
   * @param list
   * @param key
   * @returns {{children}|*}
   */
  const getItemByPath = (list, key) => {
    let item;
    for (let i = 0; i < list.length; i++) {
      let o = list[i];
      if (o.children) {
        item = getItemByPath(o.children, key);
        if (!_.isEmpty(item)) {
          break;
        }
      } else {
        if (o.path === key) {
          item = o;
          break;
        }
      }
    }
    return item;
  };

  const getMenuItems = (routers) => {
    // 这里假设 routers 是一个包含菜单项信息的数组
    return routers.map((item) => {
      // 根据某个条件判断是否显示该菜单项
      if (item.isTrue) {
        return (
          <Menu.Item key={item.path} onClick={() => onSelect(item)}>
            {item.label}
          </Menu.Item>
        );
      }
      return null; // 如果不应该显示该菜单项，返回 null
    });
  };

  const handleSelectedKey = () => {
    let keyUrl = null;
    let url = window.location.hash.split("#")[1];
    console.log(url, "url======================");
    if (url?.indexOf("/Purchase") === -1) {
      keyUrl = url || "/";
    } else {
      keyUrl = localStorage.getItem("selectedKey");
    }
    
    return keyUrl;
  };
  const selectedKey = handleSelectedKey();

  const handleTwitter = () => {
    window.open("https://x.com/tradersdottech", "_blank");
  };
  
  const hanldeTerms = () => {
    window.open("https://traders-2.gitbook.io/untitled/friend.tech-terms-of-service", "_blank");
  };

  const handlePrivacy = () => {
    window.open("https://traders-2.gitbook.io/untitled", "_blank");
  };

  const handleDiscord = () => {
    window.open("https://discord.gg/ntPmvE3Qzz", "_blank");
  };

  const handleTelegram = () => {
    window.open("http://t.me/traderstechpublic", "_blank");
  };

  const handleRanling = (item) => {
    navigate(`/`);
  };

  console.log(selectedKey, "selectedKey======================");
  return (
    <Sider
      className="siderBar"
    >
      <div className="saderBox">
        {/* <div className="header-left">
          <p onClick={handleRanling} style={{ cursor: "pointer", margin: "52px 0 30px", textAlign: "center" }}>
            <img src={logo} style={{ width: "215px", height: "24px" }} />
          </p>
        </div> */}
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={getItems(routers)}
          onSelect={onSelect}
          selectedKeys={[selectedKey]}
        >
        </Menu>
        <div className="footer-left">
          <div className="saderBox-list" style={{ paddingTop: "30px" }}>
            <div className="saderBox-list-item" onClick={hanldeTerms}>Terms of Use</div>
            <div className="saderBox-list-item" onClick={handlePrivacy}>
              Privacy Policy
            </div>
            <div className="saderBox-list-item">
              <a href="mailto:hi@traders.tech">Contact Us</a>
            </div>
          </div>

          <div
            className="saderBox-list-item iconBox"
            style={{
              borderTop: "1px solid rgba(104, 218, 164, 0.2)",
              padding: "30px 0 0 24px",
              margin: "0 17px",
              textAlign: "center",
            }}
          >
            <i className="iconfont" style={{ fontSize: "22px", color: "#c9fdd9" }} onClick={handleTelegram}>
              &#xe659;
            </i>
            <img
              className="iconX"
              src={"/home_icon_x.svg"}
              style={{ margin: "0 40px" }}
              alt="SVG Image"
              onClick={handleTwitter}
            />
            <i className="iconfont" style={{ fontSize: "22px", color: "#c9fdd9" }} onClick={handleDiscord}>
              &#xe697;
            </i>
          </div>
        </div>
      </div>
    </Sider>
  );
}
export default SideBar;
