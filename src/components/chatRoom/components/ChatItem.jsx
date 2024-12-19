import React, { useState, useEffect, useRef } from "react";
import { message, Spin, Progress, Typography } from "antd";
import {  CloseOutlined,
} from "@ant-design/icons";
import { MESSAGE_TYPE, RTC_STATE, TERMINAL_TYPE, MESSAGE_STATUS } from "@utils/enums";
import { transform } from "@utils/emotion";
import { isNormal } from "@utils/messageType";
import HeadImage from "./HeadImage";
import FullImageBox from "./FullImageBox";
import Withdraw from "./Withdraw";
import utils from "@utils/utils";
import "./ChatItem.scss";

const { Link } = Typography;

const ChatItem = ({
  mode = 1,
  mine,
  headImage,
  showName,
  msgInfo,
  fileUrl,
  groupMembers,
  menu = true,
  onCall,
  recallMessage,
  onDelete,
  onShowReadedBox,
}) => {
  const [audioPlayState, setAudioPlayState] = useState("STOP");
  const [rightMenu, setRightMenu] = useState({ show: false, pos: { x: 0, y: 0 } });
  const chatMsgBoxRef = useRef(null);
  const audioRef = useRef(null);
  const [fullImage, setFullImage] = useState({ show: false, url: "" });

  const isAction = msgInfo.type === "ACT_RT_VOICE" || msgInfo.type === "ACT_RT_VIDEO";
  const IsNormal = () => {
    const type = msgInfo.type;
    return isNormal(type) || isAction(type);
  };



  const showRightMenu = (e, msgInfo) => {console.log(msgInfo, 'msgInfo-------------------');
    e.preventDefault();
    const currentTime = Date.now();
    const timeDifference = currentTime - msgInfo.sendTime;
    const minutesDifference = Math.floor(timeDifference / (1000 * 60)); // 转换为分钟
    if(minutesDifference <= 5){
      setRightMenu({
        show: true,
        pos: { x: e.clientX, y: e.clientY },
      });
    }
  };


  const showFullImageBox = (url) => {
    setFullImage({ show: true, url });
  };

  const closeFullImageBox = () => {
    setFullImage({ show: false, url: "" });
  };

  const menuItems = [{
    name: "withdraw",
    icon: "el-icon-refresh-left",
  }];

  const onSelectMenu = () => {
    recallMessage(msgInfo)
  };

  return (
    <div className="chat-msg-item">
      {msgInfo.type == 10 || msgInfo.type == 21 ? (
        <div className="chat-msg-tip">{msgInfo.content}</div>
      ) : msgInfo.type === 20 ? (
        <div className="chat-msg-tip">{utils.toTimeText(msgInfo.sendTime)}</div>
      ) : isNormal ? (
        <div className={`chat-msg-normal ${mine ? "chat-msg-mine" : ""}`}>
          <div className="head-image">
            <img className="avatar-image" src={fileUrl + headImage} style={{width: '36px', height: '36px', borderRadius: '50%', marginTop: '4px'}} alt={name} loading="lazy" />
          </div>
          <div className="chat-msg-content">
            {mode === 1 && msgInfo.groupId && !msgInfo.selfSend && (
              <div className="chat-msg-top">
                <span>{showName}</span>
              </div>
            )}
            {mode === 2 && (
              <div className="chat-msg-top">
                <span>{showName}</span>
                <span>{utils.toTimeText(msgInfo.sendTime)}</span>
              </div>
            )}
            <div className="chat-msg-bottom" onContextMenu={(e) => showRightMenu(e, msgInfo)}>
              <div ref={chatMsgBoxRef}>
                {msgInfo.type == MESSAGE_TYPE.TEXT && (
                  <span
                    className="chat-msg-text"
                    dangerouslySetInnerHTML={{ __html: transform(msgInfo.content) }}
                  ></span>
                )}
                {msgInfo.type === MESSAGE_TYPE.IMAGE && (
                  <div className="chat-msg-image">
                    <div className="img-load-box">
                      <img
                        className="send-image"
                        src={JSON.parse(msgInfo.content).thumbUrl}
                        onClick={() => showFullImageBox(JSON.parse(msgInfo.content).thumbUrl)}
                        alt=""
                      />
                    </div>
                    {/* <span title="发送失败" onClick="onSendFail" className="send-fail el-icon-warning"></span> */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null} 
      {
        rightMenu.show && <Withdraw
        pos={rightMenu.pos}
        items={menuItems}
        onClose={(e) => { 
          if(e){
            e.preventDefault();  
          }
          
          setRightMenu({
            show: false,
            pos: { x: 0, y: 0 },
          });
        }}
        onSelect={onSelectMenu}
      />
      }
      
      <FullImageBox visible={fullImage.show} url={fullImage.url} onClose={closeFullImageBox} />
    </div>
  )
};

export default ChatItem;
