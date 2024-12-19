/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-07-11 16:56:44
 * @LastEditors: chenhua
 * @LastEditTime: 2024-08-07 17:41:37
 */
import home_icon_qb from "@/statics/images/home_icon_qb.png";
import { Button } from "antd";
import LoginWallet from "@comp/loginWallet";
import home_icon_wallet from "@/statics/images/home_icon_wallet.png";

function ConnectWallet(props) {
  return (
    <div className="connectWallet" style={{ margin: props.isMargin ? "0 0 20px 0" : "0 40px 20px" }}>
      <h1>Main Wallet</h1>
      <div className="connectWallet-box">
        <img className="connectWallet-box-img" src={props.isRanking ? home_icon_wallet : home_icon_qb} alt="" style={props.isRanking ? {width: "89px", height: "79px"} : {width: "81px", height: "81px"}}/>
        <p style={{marginTop: '8px'}}>{props.content}</p>
        {props?.isRanking ? (
          <Button className="mainWallet" onClick={() => props.handleMainWallet()}>
            {props.btnTitle}
          </Button>
        ) : (
          <LoginWallet title={props.btnTitle} />
        )}
      </div>
    </div>
  );
}
export default ConnectWallet;