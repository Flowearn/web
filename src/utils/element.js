/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-06-29 17:40:38
 * @LastEditors: chenhua
 * @LastEditTime: 2024-07-17 14:16:18
 */
const fixTop = (e) => {
  // var offset = e.offsetTop;
  // if (e.offsetParent != null) {
  //   offset += fixTop(e.offsetParent);
  // }
  // return offset;
  let offset = e.offsetTop;
  let parent = e.offsetParent;

  while (parent && parent !== document.body) {
    offset += parent.offsetTop;
    parent = parent.offsetParent;
  }

  return offset;
};

const fixLeft = (e) => {
  var offset = e.offsetLeft;
  if (e.offsetParent != null) {
    offset += fixLeft(e.offsetParent);
  }
  return offset;
};

// let setTitleTip = (tip) => {
// 	let title = import.meta.env.VUE_APP_NAME;
// 	if(tip){
// 		title = `(${tip})${title}`;
// 	}
// 	document.title =title;

// }

export {
  fixTop,
  fixLeft,
  // setTitleTip
};
