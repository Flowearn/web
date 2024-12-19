/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-06-26 14:04:15
 * @LastEditors: chenhua
 * @LastEditTime: 2024-07-31 18:48:34
 */
import { useEffect, useState } from "react";
import ChatItem from "./components/ChatItem";
import ChatBox from "./components/ChatBox";
import { useDispatch, useSelector } from "react-redux";
import { connect, reconnect, close, sendMessage, onConnect, onMessage, onClose } from '@utils/wssocket';
import TokenManager from "@utils/TokenManager";
import { setChatMsg } from "@redux/actions/chatMsgAction";
import "./index.scss";

// const wsUrl = 'ws://172.16.2.234:8878/im';
const wsUrl = import.meta.env.VITE_WS_URL;
function ChatRoom({ KeyID }) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  const dispatch = useDispatch();
  // const [msgList, setMsgList] = useState([]);
  const [activeChat, setActiveChat] = useState({
    atAll: false,
    atMe: false,
    headImage: "",
    lastContent: "4",
    lastSendTime: 1719563097189,
    lastTimeTip: 1719563091671,
    messages: [],
    showName: "小仙女粉丝群",
    targetId: 1,
    type: "GROUP",
    unreadCount: 0
  });

  useEffect(() => {
    handleConnect();
    onConnect((dd) => {
      // 加载离线消息
      // pullPrivateOfflineMessage(48);
    });
    onMessage((cmd, data) => {
      console.log("Received message:", cmd, data);
      dealChatMsg(data)
      setActiveChat(prevChat => ({
        ...prevChat,
        messages: [...prevChat.messages, data]
      }));
      // console.log()
    });

    onClose((e) => {
      console.log("WebSocket closed", e);
    });

    return () => {
      close();
    };
  }, []);

  const handleConnect = () => {
    console.log(wsUrl, 'process.env.WS_URLprocess.env.WS_URL');
    connect(wsUrl, TokenManager.getToken());
  }

  const dealChatMsg = (data) => {
    console.log(data, 'data收到消息------------------ddddddddddd')
    setActiveChat(prevChat => ({
      ...prevChat,
      messages: [...prevChat.messages, data]
    }));
    dispatch(setChatMsg(data));
  }

  return (
    <div className="chat-page">
      <ChatBox chat={activeChat} groupId={KeyID}/>
    </div>
  );
}

export default ChatRoom;
