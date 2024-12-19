/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-05-11 10:16:41
 * @LastEditors: chenhua
 * @LastEditTime: 2024-06-12 11:15:58
 */
import React from "react";
import './index.scss';
import WalletMultiButton from "@comp/wallet/WalletMultiButton";


function ConnectWallet(props) {
  return (
    <div className="walletBtn loginBtn login">
      <i className="iconfont" style={{ color: '#c9fdd9', fontSize: '20px', marginRight: '8px'}}>&#xe687;</i>
      <WalletMultiButton />
    </div>
  );
}
export default ConnectWallet;
