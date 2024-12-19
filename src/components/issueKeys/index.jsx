/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-07-11 16:56:44
 * @LastEditors: chenhua
 * @LastEditTime: 2024-07-30 09:35:49
 */

import { Button } from "antd";
import mp_icon_keys from '@/statics/images/mp_icon_keys.svg';
import aptos2 from '@/statics/images/aptos-2.svg';


function IssueKeys(props) {
  
  return (
    <div className="connectWallet" style={{margin: '20px 0'}}>
      <h1>Main  Wallet</h1>
      <div className="connectWallet-box">
        <img src={mp_icon_keys} alt="" style={{width: '151px', height:'106px'}}/>
        <p>Issue your portfolio NFT keys to get paid for being followed</p>
        <Button className='mainWallet' onClick={() => props.handleRegister()}><img src={aptos2} style={{width: '30px', height:'30px'}} alt=""/>Issue Keys</Button>
      </div>
    </div>
    
  );
}
export default IssueKeys;
