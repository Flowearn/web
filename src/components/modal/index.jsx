/*
 * @description: 弹框
 * @author: chenhua
 * @Date: 2023-10-09 14:45:55
 * @LastEditors: chenhua
 * @LastEditTime: 2023-10-09 17:30:24
 */
import { Modal } from "antd";
import _ from "lodash";
// import { useState } from "react";

function ThModal(props) {
  /**
   * 点击确认回调
   */
  const handleOk = () => {
    _.isFunction(props.onOk) && props.onOk();
    // _.isFunction(props.setVisible) && props.setVisible();
  };
  /**
   * 点击取消的回调
   */
  const handleCancel = () => {
    _.isFunction(props.onCancel) && props.onCancel();
    _.isFunction(props.setVisible) && props.setVisible();
  };

  return (
    <Modal
      {...props}
      centered
      mask={false}
      destroyOnClose={true}
      onOk={handleOk}
      onCancel={handleCancel}
      maskClosable={false}
    />
  );
}

export default ThModal;
