/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-06-29 16:24:00
 * @LastEditors: chenhua
 * @LastEditTime: 2024-07-19 18:27:42
 */
// emoji.js
const emoTextList = [
  "憨笑",
  "媚眼",
  "开心",
  "坏笑",
  "可怜",
  "爱心",
  "笑哭",
  "拍手",
  "惊喜",
  "打气",
  "大哭",
  "流泪",
  "饥饿",
  "难受",
  "健身",
  "示爱",
  "色色",
  "眨眼",
  "暴怒",
  "惊恐",
  "思考",
  "头晕",
  "大吐",
  "酷笑",
  "翻滚",
  "享受",
  "鼻涕",
  "快乐",
  "雀跃",
  "微笑",
  "贪婪",
  "红心",
  "粉心",
  "星星",
  "大火",
  "眼睛",
  "音符",
  "叹号",
  "问号",
  "绿叶",
  "燃烧",
  "喇叭",
  "警告",
  "信封",
  "房子",
  "礼物",
  "点赞",
  "举手",
  "拍手",
  "点头",
  "摇头",
  "偷瞄",
  "庆祝",
  "疾跑",
  "打滚",
  "惊吓",
  "起跳",
];

const transform = (content) => {
  // eslint-disable-next-line no-useless-escape
  return content.replace(/\#[\u4E00-\u9FA5]{1,3}\;/gi, textToImg);
};

// 将匹配结果替换表情图片
const textToImg = (emoText) => {
  // eslint-disable-next-line no-useless-escape
  let word = emoText.replace(/\#|\;/gi, "");
  let idx = emoTextList.indexOf(word);
  if (idx === -1) {
    return emoText;
  }
  
  // eslint-disable-next-line no-undef
  let url = `/statics/emoji/${idx}.gif`; // 使用相对路径导入图片
  return `<img src="${url}" style="width:35px;height:35px;vertical-align:bottom;"/>`;
};

const textToUrl = (emoText) => {
  // eslint-disable-next-line no-useless-escape
  let word = emoText.replace(/\#|\;/gi, "");
  let idx = emoTextList.indexOf(word);
  if (idx === -1) {
    return "";
  }
  // eslint-disable-next-line no-undef
  let url = `/statics/emoji/${idx}.gif`; // 使用相对路径导入图片
  return url;
};

export { emoTextList, transform, textToImg, textToUrl };
