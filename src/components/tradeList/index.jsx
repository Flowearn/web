/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-05-22 19:55:29
 * @LastEditors: chenhua
 * @LastEditTime: 2024-09-04 20:04:38
 */
import React, { useEffect, useState } from 'react';
import btcIcon from "@statics/images/home_icon_btc.svg";
import mp_bj_mr from "@statics/images/mp_bj_mr.svg";
import solanaIcon from "@statics/images/solana_icon.svg";
import ethIcon from "@statics/images/eth_icon.svg";
import aptos from "@statics/images/mp_icon_aptos.svg";
import base from "@statics/images/base.svg";
import "./index.scss";
import utils from "@utils/utils";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Decimal from "@comp/decimal";


function TradeList(props) {  
  console.log(props, '---------------------props--------------')
  return (
    <div className="trader-list">
      {
        props.list.map(item => (
          <div className="trader-list-item" key={item.token_id}>
          <div className="trader-list-item-type">
            <img src={item.logo_uri ? item.logo_uri : mp_bj_mr} alt="" />
            <span>{item.symbol}</span>
          </div>
          <div className="trader-list-item-data">
            <div className="tlid">
              <h6>Chain</h6>
              <img src={item.chain_id === "solana"
              ? solanaIcon
              : item.chain_id === "ethereum"
              ? ethIcon
              : item.chain_id === "btc"
              ? btcIcon
              : item.chain_id === "base"
              ? base
              : aptos} alt="" />
            </div>
            <div className="tlid tlid-roi">
              <h6>Amount</h6>
              <p>{item.amount_str}</p>
            </div>
            <div className="tlid tlid-roi">
              <h6>ROI</h6>
              <p>{(item.roi * 100).toFixed(2)} %</p>
            </div>
            <div className="tlid tlid-pnl">
              <h6>PNL</h6>
              <p>{item.pnl}</p>
            </div>
            <div className="tlid">
              <h6>Address</h6>
              <p className="tlid-address">
                {utils.shortAccount(item.token_id, 2)}
                <CopyToClipboard text={item.token_id} onCopy={utils.handleCopy}>
                  <i
                    className="iconfont"
                    style={{ color: "rgba(187, 255, 214, 0.6)", cursor: "pointer" }}
                  >
                    &#xe68d;
                  </i>
                </CopyToClipboard>
                
              </p>
            </div>
            <div className="tlid">
              <h6>Entry Price</h6>
              <p><Decimal decimal={item.price} position={6.5} /></p>
            </div>
            <div className="tlid">
              <h6>Current Price</h6>
              <p><Decimal decimal={item.current_price} position={6.5} /></p>
            </div>
            <div className="tlid">
              <h6>Entry Time (UTC)</h6>
              <p>{utils.showYear(item.created_at)}</p>
            </div>
          </div>
        </div>
        ))
      }
      
    </div>
  );
}
export default TradeList;
