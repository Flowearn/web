/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-05-22 19:55:29
 * @LastEditors: chenhua
 * @LastEditTime: 2024-09-09 17:31:13
 */
import React, { useEffect, useState } from 'react';
import home_icon_qb from '@/statics/images/home_icon_qb.png';
import { Button } from "antd";
import LoginWallet from "@comp/loginWallet";
import utils from '@utils/utils';

function Decimal(props) {  
  const decimal = Number(props.decimal)
  const isObject = Math.abs(decimal) < 0.01;  

  const toFixedNoRound = (num, decimals) =>{
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
  }
  return (
    <div className="decimalBox" style={{margin: `0 4px`, display: "inline-block"}}>
      {
       (isObject && decimal !== 0) ?         
       <div style={{position: 'relative'}}>
          <span style={{marginRight:'1px'}}>{utils.dealDecimal(decimal).prefix}0</span>
          <span style={{fontSize: "10px", top: `${props.position}px`, position: 'absolute'}}>{utils.dealDecimal(decimal).zeroString}</span>
          <span style={{marginLeft: '6px'}}>{utils.dealDecimal(decimal).remainingPart}</span>
        </div>
        :
        <span>{decimal === 0 ? 0 : toFixedNoRound(decimal, 2)}</span>      
      }
    </div>
  );
}
export default Decimal;



