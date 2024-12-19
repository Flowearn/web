/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-07-09 15:54:01
 * @LastEditors: chenhua
 * @LastEditTime: 2024-07-18 09:31:16
 */

// import ActionType from "@/redux/actions"
// import { createReducer } from "@reduxjs/toolkit"

// const initialState = {
// 	chatMsg: []
// }

// const chatMsgReducer = createReducer(initialState, builder => {
// 	builder
// 		.addCase(ActionType.SET_CHAT_MSG, (state, action) => {
// 			state.chatMsg = action.payload
// 		})
// 		.addDefaultCase((state, action) => {})
// })

// export default chatMsgReducer;

import ActionType from "@/redux/actions";
import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  privateMsgMaxId: 0,
  groupMsgMaxId: 0,
  chats: [],
};

const findChat = (state, msgInfo) => {
  const type = msgInfo.groupId ? 'GROUP' : 'PRIVATE';
  const targetId = msgInfo.groupId;
  return state.chats.find(chat => chat.type === type && chat.targetId === targetId) || null;
};

const findMessage = (chat, msgInfo) => {
  if (!chat) {
    return null;
  }
  return chat.messages.find(message => {
    if (msgInfo.id && message.id == msgInfo.id) {
      return true;
    }
    if (msgInfo.tmpId && message.tmpId && message.tmpId == msgInfo.tmpId) {
      return true;
    }
    return false;
  }) || null;
};

const chatMsgReducer = createReducer(initialState, builder => {
  builder
    .addCase(ActionType.SET_CHAT_MSG, (state, action) => {
      const msgInfo = action.payload;
      const type = msgInfo.groupId ? 'GROUP' : 'PRIVATE';

      if (msgInfo.id && type === "GROUP" && msgInfo.id > state.groupMsgMaxId) {
        state.groupMsgMaxId = msgInfo.id;
      }

      let chat = findChat(state, msgInfo) || { type, targetId: msgInfo.groupId, messages: [] };

      let message = findMessage(chat, msgInfo);
      if (message) {
        Object.assign(message, msgInfo);
        if (msgInfo.type === 'RECALL') {
          chat.lastContent = msgInfo.content;
        }
      } else {
        // Insert new message logic...
        if (msgInfo.type === 'IMAGE') {
          chat.lastContent = "[图片]";
        } else if (msgInfo.type === 'FILE') {
          chat.lastContent = "[文件]";
        }
        chat.lastSendTime = msgInfo.sendTime;
        chat.sendNickName = msgInfo.sendNickName;

        if (!msgInfo.selfSend && msgInfo.status !== 'READED' && msgInfo.type !== 'TIP_TEXT') {
          chat.unreadCount++;
        }
        if (!msgInfo.selfSend && chat.type === "GROUP" && msgInfo.atUserIds && msgInfo.status !== 'READED') {
					let userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
          const userId = userInfo.ID;
          if (msgInfo.atUserIds.includes(userId)) {
            chat.atMe = true;
          }
          if (msgInfo.atUserIds.includes(-1)) {
            chat.atAll = true;
          }
        }

        if (!chat.lastTimeTip || (chat.lastTimeTip < msgInfo.sendTime - 600 * 1000)) {
          chat.messages.push({
            sendTime: msgInfo.sendTime,
            type: 20,
          });
          chat.lastTimeTip = msgInfo.sendTime;
        }

        let insertPos = chat.messages.length;
        if (msgInfo.id && msgInfo.id > 0) {
          for (let idx in chat.messages) {
            if (chat.messages[idx].id && msgInfo.id < chat.messages[idx].id) {
              insertPos = idx;
              console.log(`消息出现乱序,位置:${chat.messages.length},修正至:${insertPos}`);
              break;
            }
          }
        }
        console.log('消息成功存储:', chat.messages);
        chat.messages.splice(insertPos, 0, msgInfo);
        state.chats = state.chats.filter(c => c.targetId !== chat.targetId).concat(chat);
      }
    });
});

export default chatMsgReducer;

