/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-01-11 13:40:59
 * @LastEditors: chenhua
 * @LastEditTime: 2024-07-16 21:18:25
 */
import {createSelector} from "@reduxjs/toolkit";
import _ from "lodash";

const allState = state => state

const purchaseState = state => state.purchaseReducer; // 获取 purchaseReducer 状态
const getPurchaseReducer = createSelector(purchaseState, s => {
  return s.priceObj;
});

const balanceState = state => state.balanceReducer; // 获取 balanceState 状态
const getBalanceReducer = createSelector(balanceState, s => {
  return s.balanceCoin;
});

const avatarState = state => state.avatarReducer; // 获取 avatar 
const getAvatarReducer = createSelector(avatarState, s => {
  return s.avatarUrl;
});

const connectWalletState = state => state.connectWalletReducer; // 获取连接
const getConnectWalletReducer = createSelector(connectWalletState, s => {
  return s.connectWallet;
});

const walletTypeState = state => state.walletTypeReducer; // 获取 balanceState 状态
const getWalletTypeReducer = createSelector(walletTypeState, s => {
  return s.walletType;
});

const nickNameState = state => state.nickNameReducer; // 获取 nickName
const getNickNameReducer = createSelector(nickNameState, s => {
  return s.nickName;
});

const chatMsgState = state => state.chatMsgReducer; 
const getChatMsgReducer = createSelector(
  chatMsgState,
  (chatMsgReducerState) => {
    console.log(chatMsgReducerState, 'chatMsgReducerStatechatMsgReducerStatechatMsgReducerState')
    return {
      privateMsgMaxId: chatMsgReducerState.privateMsgMaxId,
      groupMsgMaxId: chatMsgReducerState.groupMsgMaxId,
      chats: chatMsgReducerState.chats,
    };
  }
);
export { getPurchaseReducer, getBalanceReducer, getAvatarReducer, getConnectWalletReducer, getWalletTypeReducer, getChatMsgReducer, getNickNameReducer };