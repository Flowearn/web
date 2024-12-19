/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2023-10-09 10:55:57
 * @LastEditors: chenhua
 * @LastEditTime: 2024-09-12 16:31:45
 */
// import html2canvas from "html2canvas";
import { message } from "antd";
const utils = {
  downloadFile: function (url, name) {
    // 创建一个 XMLHttpRequest 对象
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true); // 设置文件的下载链接
    xhr.responseType = "blob";

    xhr.onload = () => {
      if (xhr.status === 200) {
        // 将响应转换为 Blob 对象
        const blob = new Blob([xhr.response], {
          type: "application/octet-stream",
        });

        // 创建一个虚拟链接
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob); // 将 Blob 对象转换为可下载的链接
        link.download = name; // 设置文件的下载名称

        // 触发点击事件
        document.body.appendChild(link);
        link.click();

        // 清理并移除虚拟链接
        document.body.removeChild(link);
      }
    };

    // 发送请求
    xhr.send();
  },
  transFileSize: function (size) {
    //文件大小转换
    let sizeNum = parseInt(size, 10);
    if (sizeNum > 1000000000) {
      return Math.floor(sizeNum / 10000000) / 100 + "GB";
    } else if (sizeNum > 1000000) {
      return Math.floor(sizeNum / 10000) / 100 + "MB";
    } else if (sizeNum > 1000) {
      return Math.floor(sizeNum / 10) / 100 + "KB";
    } else {
      return sizeNum + "B";
    }
  },
  // saveDomAsImage: function (dom, fileName = "", scale = 1) {
  //   // 将html通过canvas转换成图片并保存
  //   return new Promise((resolve, reject) => {
  //     html2canvas(dom, {
  //       width: dom.offsetWidth,
  //       height: dom.offsetHeight,
  //       allowTaint: true,
  //       scale: scale,
  //     }).then(
  //       (canvas) => {
  //         // path 1
  //         var link = document.createElement("a");
  //         link.href = canvas.toDataURL("image/jpeg");
  //         link.download = (fileName || Date.now()) + ".jpg";
  //         document.body.appendChild(link);
  //         link.click();
  //         link.remove();
  //         resolve();
  //       },
  //       (err) => {
  //         reject(err);
  //       }
  //     );
  //   });
  // },
  cidStartAndEnd: function (value, num) {
    // const num = length;
    const chars = value.toString().split("");
    if (chars.length <= 9) return value;
    const start = chars.slice(0, num).join("");
    const end = chars.slice(chars.length - 4).join("");
    return {
      value,
      start,
      end,
    };
  },
  shortAccount: function (value, num) {
    if (!value) return "-";
    const result = utils.cidStartAndEnd(value, num);
    if (!result || !result.start || !result.end) return value; // 添加对结果及其属性的判空处理
    const { start, end } = result;
    return `${start}…${end}`;
  },
  getDomainName: function () {
    return `${window.location.origin}/api/`;
  },
  calculatePrice: function (num, price) {
    if (!num || !price) return 0;
    return (num * price).toFixed(2);
  },
  dealTime: function (creationTimes) {
    // 当前时间
    if (!creationTimes) return "";
    const currentTime = new Date();
    // 计算时间间隔（毫秒）
    const timeDifference = currentTime.getTime() - Date.parse(creationTimes);
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day ago`;
    } else if (hours > 0) {
      return `${hours} hours ago`;
    } else if (minutes > 0) {
      return `${minutes} minutes ago`;
    } else {
      return `${seconds} seconds ago`;
    }
  },
  showYear: function (dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);

    // 提取年月日时分秒信息
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从 0 开始，需要加 1
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    const second = String(date.getSeconds()).padStart(2, "0");

    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    console.log(isMobile, '000000000000000000000-------------------');
    if(isMobile){
      return `${year}-${month}-${day} ${hour}:${minute}`;
    }else{
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }
    
  },
  bytesToHex: function (bytes) {
    return Array.prototype.map
      .call(bytes, (byte) => {
        return ("0" + (byte & 0xff).toString(16)).slice(-2);
      })
      .join("");
  },
  handleCopy: function () {
    message.success("copy successfully");
  },
  dealColor: function (roi) {
    return roi >= 0 ? "#2ddda4" : "#FF4D00";
  },
  dealDecimal: function (number) {
    if (typeof number !== "number") {
      number = parseFloat(number);
    }
    if (number && isNaN(number)) {
      return;
    }
    // 将数字转换为科学记数法
    let scientificNotation = number.toExponential();

    // 提取指数部分
    let exponent = parseInt(scientificNotation.split("e-")[1]);

    // 提取小数部分，并去掉小数点
    let decimalPart = scientificNotation.split("e-")[0].replace(".", "");

    // 前缀“0.”
    let prefix = "0.";

    // 计算“41”部分
    let zeroCount = exponent - 1; // 减去1，因为有一个“0”是在小数点之后
    let zeroString = "0".repeat(zeroCount);

    // 取剩余部分
    let remainingPart = Math.abs(decimalPart.substring(0, 2)); // 保留前4位有效数字

    // 判断是否为负数
    let isNegative = number < 0;
    if (isNegative) {
      prefix = "-" + prefix;
    }

    return {
      prefix: prefix,
      zeroString: zeroString.length,
      remainingPart,
    };
  },
  getProvider: function (type) {
    let provider;
    if (type === "metamask") {
      provider = window?.ethereum;
    } else if (type === "okex") {
      provider = window?.okxwallet;
    }
    return provider;
  },
  unitConvert: function (value) {
    if (value == null) {
      return 0;
    } else {
      return parseFloat(value) / 100000000;
    }
  },
  toTimeText: function (timeStamp, simple) {
    let dateTime = new Date(timeStamp);
    let currentTime = Date.parse(new Date());
    let timeDiff = currentTime - dateTime;
    let timeText = "";
    if (timeDiff <= 60000) {
      //Within one minute
      timeText = "Just now";
    } else if (timeDiff > 60000 && timeDiff < 3600000) {
      //Within 1 hour
      timeText = Math.floor(timeDiff / 60000) + " minutes ago";
    } else if (
      timeDiff >= 3600000 &&
      timeDiff < 86400000 &&
      !utils.isYestday(dateTime)
    ) {
      // today
      timeText = utils.formatDateTime(dateTime).substr(11, 5);
    } else if (utils.isYestday(dateTime)) {
      // yesterday
      timeText = "yesterday " + utils.formatDateTime(dateTime).substr(11, 5);
    } else if (utils.isYear(dateTime)) {
      // this year
      timeText = utils.formatDateTime(dateTime).substr(5, simple ? 5 : 14);
    } else {
      // Not belonging to this year
      timeText = utils.formatDateTime(dateTime);
      if (simple) {
        timeText = timeText.substr(2, 8);
      }
    }
    return timeText;
  },
  isYestday: function (date) {
    let yesterday = new Date(new Date() - 1000 * 60 * 60 * 24);
    return (
      yesterday.getYear() === date.getYear() &&
      yesterday.getMonth() === date.getMonth() &&
      yesterday.getDate() === date.getDate()
    );
  },
  isYear: function (date) {
    return date.getYear() === new Date().getYear();
  },
  formatDateTime: function (date) {
    if (date === "" || !date) {
      return "";
    }
    let dateObject = new Date(date);
    let y = dateObject.getFullYear();
    let m = dateObject.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    let d = dateObject.getDate();
    d = d < 10 ? "0" + d : d;
    let h = dateObject.getHours();
    h = h < 10 ? "0" + h : h;
    let minute = dateObject.getMinutes();
    minute = minute < 10 ? "0" + minute : minute;
    let second = dateObject.getSeconds();
    second = second < 10 ? "0" + second : second;
    return y + "/" + m + "/" + d + " " + h + ":" + minute + ":" + second;
  },
  uint8ArrayToHex: function (address){
    console.log(address, address instanceof Uint8Array, 'address instanceof Uint8Array------------------------address instanceof Uint8Array')
    if (address.data instanceof Uint8Array) {      
      return Array.from(address.data, byte => byte.toString(16).padStart(2, '0')).join('');
    } else {
      return address;
    }
  },
  normalizeAddress: function (address) {
    if (!address.startsWith("0x")) {
      return "0x" + address.toLowerCase();
    }
    return address.toLowerCase();
  }
};
export default utils;
