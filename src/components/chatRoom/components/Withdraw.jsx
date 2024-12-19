/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-07-18 10:13:58
 * @LastEditors: chenhua
 * @LastEditTime: 2024-07-18 11:01:07
 */
import React from 'react';

const Withdraw = ({ pos, items, onClose, onSelect }) => {
  const close = () => {
    onClose();
  };

  const onSelectMenu = (item) => {
    onSelect(item);
    close();
  };

  return (
    <div className="right-menu-mask" onClick={close} onContextMenu={(e) => { e.preventDefault(); close(); }}>
      <div className="right-menu" style={{ left: pos.x + 'px', top: pos.y + 'px' }}>
        <ul className="right-menu-elmenu">
          {items.map((item) => (
            <li key={item.key} className="right-menu-elmenu-item" onClick={() => onSelectMenu(item)}>
              {item.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Withdraw;
