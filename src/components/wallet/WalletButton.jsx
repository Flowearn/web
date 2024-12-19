/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-06-11 13:59:27
 * @LastEditors: chenhua
 * @LastEditTime: 2024-06-11 14:14:55
 */
import React from "react";

function WalletButton(props) {
  return (
    <button
      className={`wallet-adapter-button ${props.className || ""}`}
      disabled={props.disabled}
      style={props.style}
      onClick={props.onClick}
      tabIndex={props.tabIndex || 0}
      type="button"
    >
      {props.startIcon && <i className="wallet-adapter-button-start-icon">{props.startIcon}</i>}
      {props.children}
      {props.endIcon && <i className="wallet-adapter-button-end-icon">{props.endIcon}</i>}
    </button>
  );
}
export default WalletButton;
