/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-06-29 14:47:07
 * @LastEditors: chenhua
 * @LastEditTime: 2024-08-09 15:34:10
 */
import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { emoTextList, textToImg } from '@utils/emotion'

const Emotion = forwardRef (({ onEmotion, pops }, ref) => {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onClickEmo = (emoText) => {
    let emotion = `#${emoText};`
    onEmotion(emotion);
    console.log(emoText, 'pos--------------rere')
  };

  const open = () => {
    // console.log(pos, 'pos--------------rere')
    // setPos(pos);
    setShow(true);
  };

  const close = () => {
    setShow(false);
  };

  useImperativeHandle(ref, () => ({
    open: open,
    close: close,
  }));

  return (
    <>
     { show && <div onClick={close} style={{ width: '100%', position: 'absolute', left: `5px`, top: `160px`, zIndex: 9 }}>
        <div className="emotion-box" >
          <Scrollbars style={{ height: 270 }} className="emotion-box-scroll">
            <div className="emotion-item-list">
              {emoTextList.map((emoText, i) => (
                <div
                  className="emotion-item"
                  key={i}
                  onClick={() => onClickEmo(emoText)}
                  dangerouslySetInnerHTML={{ __html: textToImg(emoText) }}
                />
              ))}
            </div>
          </Scrollbars>
        </div>
      </div>
    }
    </>
  );
});

export default Emotion;
