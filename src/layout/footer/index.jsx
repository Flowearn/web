/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2023-02-07 19:08:16
 * @LastEditors: chenhua
 * @LastEditTime: 2024-01-03 20:24:20
 */
import { Layout, Menu, Button, Image } from "antd";
// import _ from "lodash";
import "./index.scss";
const { Footer } = Layout;

function FooterBar() {
  // console.log(routers, "---------------------");  background: url("@statics/images/bg_banner.png");
  return (
    <Footer className="footer">
      <div className="footer-left">
        <Image
          width={60}
          height={40}
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        />
      </div>
      <div className="footer-right">
        <Button className="login">Login in</Button>
      </div>
    </Footer>
  );
}
export default FooterBar;
