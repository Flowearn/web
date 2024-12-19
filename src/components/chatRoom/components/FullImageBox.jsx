/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-07-11 16:56:44
 * @LastEditors: chenhua
 * @LastEditTime: 2024-07-18 15:36:44
 */
import React from "react";
import { Modal } from "antd";
import ThModal from "@comp/modal";

const FullImageBox = ({ visible, url, onClose }) => {
  return (
    <ThModal open={visible} footer={null} onCancel={onClose} width="50%" >
      <img src={url} alt="Full View" style={{ width: "100%", marginTop: "30px"}} />
    </ThModal>
  );
};

export default FullImageBox;
