import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button, Upload, Tooltip, message } from "antd";
import {
  PictureOutlined,
  SmileOutlined,
  CloseOutlined,
  DoubleRightOutlined,
  DoubleLeftOutlined
} from "@ant-design/icons";
import ChatItem from "./ChatItem";
import GroupMember from "./GroupMember";
import Emotion from "./Emotion";
import ChatAtBox from "./ChatAtBox";
import { textToUrl } from "@utils/emotion";
import "./ChatBox.scss";
import { sendGroupMsg, queryGroupMembers, pullOfflineMessage, uploadImage, recallMsg } from "@/services/chatApi";
import { useDispatch, useSelector } from "react-redux";
import { setChatMsg } from "@redux/actions/chatMsgAction";
import { getChatMsgReducer } from "@redux/reselectors";
import { sendHeart } from '@utils/wssocket';
import utils from '@utils/utils';


const fileUrl = import.meta.env.VITE_FILE_ACCESS_API;
const elementWidth = import.meta.env.VITE_ELEMENT_WIDTH;

const ChatBox = ({ chat, groupId }) => {
  const chatScrollBoxRef = useRef(null);
  const dispatch = useDispatch();
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  const chats = useSelector(getChatMsgReducer);
  const chatsObj = chats?.chats?.find(item => item.targetId === Number(groupId));
  console.log(groupId, 'groupIdgroupIdgroupId-----------------', chats, chatsObj)
  const [chatMessages, setChatMessages] = useState([]);

  const [groupMembers, setGroupMembers] = useState([]);
  const [sendImageUrl, setSendImageUrl] = useState("");
  const [placeholder, setPlaceholder] = useState("Type your text here");
  const [showMinIdx, setShowMinIdx] = useState(chat.messages.length > 30 ? 40 - 30 : 0);
  const [focusNode, setFocusNode] = useState(null);
  const [focusOffset, setFocusOffset] = useState(null);
  const [atSearchText, setAtSearchText] = useState("");
  const [imgMsgInfo, setImgMsgInfo] = useState({});
  const [hasCalled, setHasCalled] = useState(false);
  const [showGroupMember, setShowGroupMember] = useState(true);

  const editBoxRef = useRef(null);
  const atBoxRef = useRef(null);
  const focusNodeRef = useRef(null);
  const emotionRef = useRef(null);
  const emotion = useRef(null);

  useEffect(() => {
    sendHeart((isHeartSent) => {
      if (isHeartSent && groupId && !hasCalled) {
        console.log('心跳包已发送----------------');
        getGroupMembers();
        getOfflineMessage();  
        setHasCalled(true);
      }
    });   
  }, [groupId, hasCalled])

  const getOfflineMessage = async() => {
    const res = await pullOfflineMessage({
      minId: 0,
      keyId: groupId,
    })
  };

  const getGroupMembers = async () => {
    const res = await queryGroupMembers(groupId);
    setGroupMembers(res.data || [])
  }

  const showEmotionBox = (e) => {
    e.stopPropagation();
    emotionRef.current.open();
  };

  const onEmotion = (emoText) => {console.log('555555555555555555')
    setPlaceholder('');
    if (editBoxRef.current) {
      editBoxRef.current.focus();

      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const element = document.createElement("img");
        element.className = "emo";
        element.dataset.code = emoText;
        element.contentEditable = "true";
        element.setAttribute("src", textToUrl(emoText));

        // 插入元素到光标位置
        range.insertNode(element);

        // 移动光标到插入的元素后面
        range.setStartAfter(element);
        range.collapse(true);
      }
    }
  };

  const onEditBoxBlur = () => {
    const selection = window.getSelection();
    setFocusNode(selection.focusNode);
    setFocusOffset(selection.focusOffset);
  };

  const onEditorInput = (e) => {
    // if (chat.type === 'GROUP' && !zhLock) {
    console.log(e, "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
    setPlaceholder('')
    if (e.nativeEvent.data === "@") {
      showAtBox(e);
    } else {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      focusNodeRef.current = selection.focusNode;
      const stIdx = focusNodeRef.current.textContent.lastIndexOf("@");
      console.log(stIdx, "focusNodeRef.current.textContent.substring(stIdx + 1)");
      setAtSearchText(focusNodeRef.current.textContent.substring(stIdx + 1));
    }
    // }
  };

  const scrollToBottom = () => {
    const div = chatScrollBoxRef.current;
    if (div) {
      div.scrollTop = div.scrollHeight + 20;
    }
  };

  const onScroll = (e) => {
    const scrollElement = e.target;
    const scrollTop = scrollElement.scrollTop;
    if (scrollTop < 30) {
      // 多展示20条信息
      setShowMinIdx((prev) => (prev > 20 ? prev - 20 : 0));
    }
  };

  useEffect(() => {
    const div = chatScrollBoxRef.current;
    if (div) {
      div.addEventListener("scroll", onScroll);
      // Scroll to bottom initially
      scrollToBottom();

      // Clean up the event listener on unmount
      return () => {
        div.removeEventListener("scroll", onScroll);
      };
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom();
  }, [chatsObj?.messages]);

  const html2Escape = (strHtml) => {
    return strHtml.replace(/[<>&"]/g, (c) => {
      return {
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
      }[c];
    });
  };

  const createSendText = () => {
    const childNodes = editBoxRef.current.childNodes;
    let sendText = "";
    childNodes.forEach((node) => {
      if (node.nodeName === "#text") {
        sendText += html2Escape(node.textContent);
      } else if (node.nodeName === "SPAN") {
        sendText += node.innerHTML;
      } else if (node.nodeName === "IMG") {
        sendText += node.dataset.code;
      }  else if (node.nodeName === "DIV") {
        sendText += "\n"; 
        sendText += node.textContent.trim();
        sendText += "\n"; 
      }
    });
  
    return sendText;
  };
  

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }    
  }

  const sendMessage = async() => {
    const sendText = createSendText();
    if (!sendText.trim()) {
      return
    }

    let msgInfo = {
      content: sendText,
      type: 0,
      groupId: Number(groupId),
    };
   
    msgInfo.atUserIds = await createAtUserIds();
    const res = await sendGroupMsg(msgInfo)
    if(res.code === 200){
      clearInput()
      msgInfo.id = res.data;
      msgInfo.sendTime = new Date().getTime();
      msgInfo.sendId = userInfo.ID;
      msgInfo.selfSend = true;
      msgInfo.sendNickName = userInfo.NickName || userInfo.address;
      setChatMessages(prevMessages => [...prevMessages, msgInfo]);
      dispatch(setChatMsg(msgInfo));
      setPlaceholder('Type your text here')
    }
  };

  const createAtUserIds = async() => {       
    const childNodes = editBoxRef.current.childNodes
    let ids = [];
    childNodes.forEach((node) => {
      if (node.nodeName == "SPAN") {
        ids.push(node.dataset.id);
      }
    });
    return ids;
  };

  const clearInput = () => {
    if (editBoxRef.current) {
      editBoxRef.current.textContent = ''; // 清空 <div> 元素中的文本内容
    }
  };

  const showAtBox = (e) => {
    e.stopPropagation();
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      // 记录光标所在位置和光标所在节点
      const focusNode = selection.focusNode;
      const focusOffset = selection.focusOffset;

      // 获取光标所在范围的位置信息
      const rect = range.getBoundingClientRect();
      console.log(rect, "rect=========================");
      // 调用 AtBox 组件的 open 方法
      if (atBoxRef.current) {
        atBoxRef.current.open({
          x: rect.x,
          y: rect.y,
        });
      }
    }
  };

  const onAtSelect = (member) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0 && focusNode && focusNode.nodeValue !== null) {
      const range = selection.getRangeAt(0);

      const startOffset = focusOffset - 1 - atSearchText.length;
      if (startOffset < 0 || startOffset > focusNode.nodeValue.length) {
        console.error("Invalid range start offset");
        return;
      }

      range.setStart(focusNode, startOffset);
      range.setEnd(focusNode, focusOffset);
      range.deleteContents();

      const element = document.createElement("SPAN");
      element.className = "at";
      element.dataset.id = member.id;
      element.contentEditable = "false";
      element.innerText = `@${member.NickName || utils.shortAccount(member.address,2)}`;
      range.insertNode(element);

      range.setStartAfter(element);
      range.collapse(true);

      const textNode = document.createTextNode("\u00A0");
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      range.collapse(true);

      selection.removeAllRanges();
      selection.addRange(range);

      setAtSearchText("");
      editBoxRef.current.focus();
    }
  };

  const generateId = () => {
    // 生成临时id
    return (
      String(new Date().getTime()) + String(Math.floor(Math.random() * 1000))
    );
  };

  const onImageBefore = React.useCallback(file => {
    const url = URL.createObjectURL(file);
    const data = {
      originUrl: url,
      thumbUrl: url
    };
    const msgInfo = {
      id: 0,
      tmpId: generateId(),
      fileId: file.uid,
      sendId: userInfo.ID,
      content: JSON.stringify(data),
      sendTime: new Date().getTime(),
      selfSend: true,
      type: 1,
      readedCount: 0,
      loadStatus: 'loading',
      status: 0,
      groupId: Number(groupId),
    };
    dispatch(setChatMsg(msgInfo));
    scrollToBottom();
    setImgMsgInfo(msgInfo);
  }, []);

  const handleCustomRequest = async ({ file }) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await uploadImage(formData);
    if(res.code === 200){
      onImageSuccess(res.data)
    }
  };

  const onImageSuccess = async(data) => {
    const msgInfo = JSON.parse(JSON.stringify(imgMsgInfo));
    msgInfo.content = JSON.stringify(data);
    const res = await sendGroupMsg(msgInfo)
    if(res.code === 200){
      msgInfo.loadStatus = "ok";
      msgInfo.id = res.data;
      dispatch(setChatMsg(msgInfo));
    }
  };

  const closeRefBox = () => { 
    atBoxRef.current.close(); 
    emotionRef.current.close();
  };

  const removeSendImage = () => {};

  const deleteMessage = (msgInfo) => {};

  const recallMessage = async(msgInfo) => {
    const res = await recallMsg(msgInfo.id);    
    if (res.code === 200) {
      // msgInfo.type = 10;
      // msgInfo.content = "You withdrew a message";
      // msgInfo.status = 2;
      const newMsgInfo = {
        ...msgInfo,
        type: 10,
        content: "You withdrew a message",
        status: 2,
      };
      dispatch(setChatMsg(newMsgInfo));
    }else{
      message.error('withdrawal failed')
    }
      
  };

  const headImage = (msgInfo) => {
    let member = groupMembers.find((m) => m.id == msgInfo.sendId);
    return member?.image;
  };

  const showName = (msgInfo) => {
    let member = groupMembers.find((m) => m.userId == msgInfo.sendId);
    return member ? member.aliasName : "";
  };

  const handleRightClick = () => {
    setShowGroupMember(false); // 点击右侧按钮显示 headerBox-right
  };

  const handleLeftClick = () => {
    setShowGroupMember(true); // 点击左侧按钮显示 headerBox-left
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth <= elementWidth);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= elementWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div style={{width: '100%', height: '100%', position: 'relative'}} onClick={closeRefBox}>
      <div className="headerBox">
        <div
          className="headerBox-title headerBox-left"
          style={{ width: isMobile ? '100%' : showGroupMember ? 'calc(100% - 301px)' : '100%', display: !isMobile ? 'block' : showGroupMember ? 'block' : 'none' }}
        >
          Chat Room
          {
           isMobile && <DoubleLeftOutlined
            style={{ cursor: 'pointer', float: 'right', margin: '21.5px 20px 0 0' }}
            onClick={handleRightClick}
          />
          }
        </div>
        <div
          className="headerBox-title headerBox-right"
          style={{ width: isMobile ? '100%' : !showGroupMember ? 'calc(100% - 301px)' : '301px', display: !isMobile ? 'block' : !showGroupMember ? 'block' : 'none' }}
        >
          {
           isMobile && <DoubleRightOutlined
            style={{ cursor: 'pointer', float: 'left', margin: '21.5px 0 0 13px' }}
            onClick={handleLeftClick}
          />
          }
          Followers
        </div>
      </div>
      {/* <div className="headerBox">
        <div className="headerBox-title headerBox-left">Chat Room</div>
        <div className="headerBox-title headerBox-right">Followers</div>
      </div> */}
      <div className="chat-box">      
        <div className="chat-box-header" style={{ width: isMobile ? '100%' : showGroupMember ? 'calc(100% - 301px)' : '100%', display: !isMobile ? 'block' : showGroupMember ? 'block' : 'none' }}>
          <div className="im-chat-main" id="chatScrollBox" ref={chatScrollBoxRef} onScroll={onScroll}>
            <div className="im-chat-box">
              {
                console.log(chatsObj,'0000000000--------------------------0000000000000000')
              }
              {chatsObj?.messages?.map(
                (msgInfo, index) =>
                  index >= showMinIdx && (
                    <ChatItem
                      key={index}
                      mine={msgInfo.sendId === userInfo.ID}
                      headImage={headImage(msgInfo)}
                      showName={showName(msgInfo)}
                      msgInfo={msgInfo}
                      fileUrl={fileUrl}
                      groupMembers={groupMembers}
                      deleteMessage={deleteMessage}
                      recallMessage={recallMessage}
                    />
                  )
              )}
            </div>
          </div>
          <div className="im-chat-footer">
            <div className="chat-tool-bar">
              <div ref={emotion}>
                {/* <Tooltip title="发送表情"> */}
                  <Button icon={<SmileOutlined />} onClick={(e) => showEmotionBox(e)} />
                {/* </Tooltip> */}
              </div>

              <Upload
                accept="image/*"
                beforeUpload={onImageBefore}
                // onSuccess={onImageSuccess}
                // onError={onImageFail}
                customRequest={handleCustomRequest}
                showUploadList={false}
              >
                {/* <Tooltip title="发送图片"> */}
                  <Button icon={<PictureOutlined />} />
                {/* </Tooltip> */}
              </Upload>
            </div>
            <div className="send-content-area">
              <div
                ref={editBoxRef}
                className="send-text-area"
                contentEditable
                placeholder={placeholder}
                onBlur={onEditBoxBlur}
                onInput={onEditorInput}
                onKeyDown={handleKeyDown}
              />
              {sendImageUrl && (
                <div className="send-image-area">
                  <div className="send-image-box">
                    <img src={sendImageUrl} alt="发送图片" className="send-image" />
                    <Button icon={<CloseOutlined />} onClick={removeSendImage} size="small" shape="circle" />
                  </div>
                </div>
              )}
              <Button type="primary" onClick={sendMessage} className="sendBox">
                send
              </Button>
            </div>
          </div>
        </div>
        <div className="chat-group-member groupMemberBox"  style={{ width: isMobile ? '100%' : !showGroupMember ? 'calc(100% - 301px)' : '301px', display: !isMobile ? 'block' : !showGroupMember ? 'block' : 'none' }}>
          {groupMembers?.map((member) => (
            <GroupMember key={member.id} className="group-side-member" member={member} showDel={false} />
          ))}
        </div>
      </div>
      <Emotion ref={emotionRef} onEmotion={onEmotion}></Emotion>
      <ChatAtBox ref={atBoxRef} members={groupMembers} onSelect={onAtSelect} searchText={atSearchText} fileUrl={fileUrl}></ChatAtBox>
    </div>
  );
};

export default ChatBox;
