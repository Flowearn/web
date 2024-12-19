/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-06-29 14:15:29
 * @LastEditors: chenhua
 * @LastEditTime: 2024-07-17 12:00:50
 */
import { useMemo } from "react";
// import PropTypes from 'prop-types';
// import { Avatar } from "antd";
import "./HeadImage.scss";

const HeadImage = ({ id, size = 50, width, height, radius = "10%", url, name, online, fileUrl }) => {
  const colors = [
    "#7dd24b",
    "#c7515a",
    "#db68ef",
    "#15d29b",
    "#85029b",
    "#c9b455",
    "#fb2609",
    "#bda818",
    "#af0831",
    "#326eb6",
  ];
  console.log(name, "fileUrl----------------------");

  const textColor = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash += name.charCodeAt(i);
    }
    return colors[hash % colors.length];
  }, [name, colors]);

  const avatarImageStyle = useMemo(() => {
    const w = width || size;
    const h = height || size;
    return {
      width: `${w}px`,
      height: `${h}px`,
      borderRadius: radius,
    };
  }, [width, height, size, radius]);

  const avatarTextStyle = useMemo(() => {
    const w = width || size;
    const h = height || size;
    return {
      width: `${w}px`,
      height: `${h}px`,
      color: textColor,
      fontSize: `${w * 0.6}px`,
      borderRadius: radius,
      backgroundColor: "#f2f2f2", // 默认背景色
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "1px solid #ccc",
    };
  }, [width, height, size, radius, textColor]);

  const showUserInfo = (e) => {
    if (id && id > 0) {
      // Replace this with actual HTTP request and state management logic
      console.log(`Show user info for ID: ${id}`);
    }
  };

  return (
    <div className="head-image" onClick={showUserInfo}>
      {url ? (
        <img className="avatar-image" src={fileUrl + url} style={avatarImageStyle} alt={name} loading="lazy" />
      ) : (
        <div className="avatar-text" style={avatarTextStyle}>
          {name}
        </div>
      )}
      {online && <div className="online" title="用户当前在线"></div>}
    </div>
  );
};

export default HeadImage;
