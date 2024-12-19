import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import utils from '@utils/utils';

// const ChatAtBox = ({ searchText, ownerId, members, onSelect }, ref) => {
const ChatAtBox = forwardRef (({ searchText, members, onSelect, fileUrl }, ref) => {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [activeIdx, setActiveIdx] = useState(0);
  const [showMembers, setShowMembers] = useState([]);
  const scrollBoxRef = useRef(null);
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

  useEffect(() => {
    if (show) {
      init();
    }
  }, [searchText, show]);

  const init = () => {
    if (scrollBoxRef.current) {
      scrollBoxRef.current.scrollTop = 0;
    }
    const userId = userInfo.ID; // 假设从 store 获取的 userId
    const newShowMembers = [];
    // const name = '全体成员';
    // if (ownerId === userId && name.startsWith(searchText)) {
    //   newShowMembers.push({
    //     userId: -1,
    //     aliasName: name,
    //   });
    // }

    console.log(members, '---------------------members')
    members.forEach((m) => {
      if (m.id !== userId && !m.quit) {
        if (m.nickname && m.nickname.startsWith(searchText)) {
          newShowMembers.push(m);
        } else if (m.address && m.address.startsWith(searchText)) {
          newShowMembers.push(m);
        }
      }
    });
    
    // members.forEach((m) => {
    //   console.log( m.id !== userId, !m.quit, m.aliasName.startsWith(searchText), searchText)
    //   if (m.id !== userId && !m.quit && m.aliasName.startsWith(searchText)) {
    //     newShowMembers.push(m);
    //   }
    // });
    
    setShowMembers(newShowMembers);
    setActiveIdx(newShowMembers.length > 0 ? 0 : -1);
  };

  const open = (newPos) => {
    setPos(newPos);
    setShow(true);
    init();
  };

  const close = () => {
    setShow(false);
  };

  const moveUp = () => {
    if (activeIdx > 0) {
      setActiveIdx(activeIdx - 1);
      scrollToActive();
    }
  };

  const moveDown = () => {
    if (activeIdx < showMembers.length - 1) {
      setActiveIdx(activeIdx + 1);
      scrollToActive();
    }
  };

  const select = () => {
    if (activeIdx >= 0) {
      onSelect(showMembers[activeIdx]);
    }
    close();
  };

  const scrollToActive = () => {
    const scrollBox = scrollBoxRef.current;
    if (!scrollBox) return;

    const itemHeight = 35;
    const visibleHeight = scrollBox.clientHeight;
    const currentScroll = scrollBox.scrollTop;
    const desiredScroll = activeIdx * itemHeight;

    if (desiredScroll + itemHeight > currentScroll + visibleHeight) {
      scrollBox.scrollTop = desiredScroll - visibleHeight + itemHeight;
    } else if (desiredScroll < currentScroll) {
      scrollBox.scrollTop = desiredScroll;
    }
  };

  const onSelectMember = (member) => {
    onSelect(member);
    setShow(false);
  };

  useImperativeHandle(ref, () => ({
    open: open,
    close: close,
  }));

  return (
    show && (
      <Scrollbars
        ref={scrollBoxRef}
        style={{ left: `${pos.x}px`, top: `${pos.y - 250}px`, position: 'fixed', width: '200px', height: '240px', borderRadius: '5px', backgroundColor: '#111e1e', boxShadow: '4px 4px 4px 4px rgba(0.25, 0.25, 0.25, 0.25)' }}
      >
        {showMembers.map((member, index) => (
          // <div key={item.id} onClick={() => onSelectMember(member)}>
          //   <GroupMember member={item} height={40} />
          // </div>
          <div className="chat-group-member" style={{height: '40px', width: '100%', padding: '20px 12px', marginBottom: '10px'}}  key={member.id} onClick={() => onSelectMember(member)}>
            <div className="member-avatar" style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                {/* <HeadImage name={member.nickname || member.address} url={member.image} fileUrl={fileUrl}> </HeadImage> */}
                <img className="avatar-image" src={fileUrl + member.image} alt={name} loading="lazy" style={{ width: '36px', height: '36px', borderRadius: '50%', marginRight: '10px'}}/>
                <div className="avatar-text" style={{color: '#bbffd6'}}>
                  {member.nickname || utils.shortAccount(member.address, 2)}
                </div>
            </div>
            <div className="member-name" style={{'line-height': 40+'px'}}>
                <div>{ member.aliasName }</div>
            </div>
          </div>
        ))}
      </Scrollbars>
    )
  );
});

export default ChatAtBox;
