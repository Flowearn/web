/**
 * 描述：服务请求公共方法
 * @date 2021/12/11
 */

import _ from "lodash";
import qs from "qs";
// import { message } from "antd"
import TokenManager from "@utils/TokenManager";
import requestError from "@utils/requestError";
import { message } from "antd";

const baseUrl = "/api"; //需要代理时
// const baseUrl = import.meta.env.VITE_BASE_API + ""; //直接调取接口时


const request = {
  /**
   * 基础请求
   * @param url
   * @param options
   * @returns {Promise<unknown>}
   */
  request: function (url, options = {}) {
    // url = baseUrl + commUrl + url
    console.log(url, 'url------------------------url')
    url = `${baseUrl}${url}`;
    if (!options.method) options.method = "get";
    let status = null;
    return new Promise((resolve, reject) => {
      fetch(url, options)
        .then((res) => {
          // 关闭全局loading
          status = res.status;
          _.isFunction(options.cb) && options.cb();
          if (options.responseType === "blob") {
            return res.blob();
          }
          if (options.responseType === "arraybuffer") {
            return res.arrayBuffer();
          }
          return res.json();
        })
        .then((data) => {
          if (status === 401) {
            // message.error(data?.message);
            TokenManager.removeToken();
            TokenManager.removeUserInfo();
            // window.location.reload();
            return;
          }
          if (status !== 200 && status !== 201 && status !== 202 && status !== 204) {
            // 如果数据中包含错误信息，抛出一个错误
            // resolve(data);
            if (data.code === 100009) {
              resolve(data);
            }

            if (data?.code === 100007) {
              // 弹出弹框或者做其他处理
              return;
            } else {
              return message.error(data?.error || data?.msg || data?.message || data);
            }
          }
          if (options.responseType === "blob" || options.responseType === "arraybuffer") {
            resolve(data);
          } else {
            resolve(data);
          }
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  },
  /**
   * get请求
   * @param url
   * @param options
   * @returns {Promise<void>}
   */
  get: async function (url, options = {}) {
    if (!options.method) {
      options.method = "get";
    }
    url = url + "?" + qs.stringify(options.data, { indices: false });
    // +
    // "&" +
    // new Date().getTime();
    if (!options.headers) {
      options.headers = { "Content-Type": "application/json" };
    }
    if (TokenManager.getToken()) {
      options.headers["Authorization"] = TokenManager.getToken();
    }
    return this.request(url, options);
  },
  /**
   * post请求
   * @param url
   * @param options
   * @returns {Promise<void>}
   */
  post: async function (url, options = {}) {
    if (!options.method) {
      options.method = "post";
    }
    if (options.data instanceof FormData) {
      options.body = options.data;
    } else {
      if (_.isEmpty(options.headers)) {
        options.headers = {};
      }
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(options.data);
    }
    if (TokenManager.getToken()) {
      if (_.isEmpty(options.headers)) {
        options.headers = {};
      }
      options.headers["Authorization"] = TokenManager.getToken();
    }
    return this.request(url, options);
  },
  /**
   * put请求
   * @param url
   * @param options
   * @returns {Promise<void>}
   */
  put: async function (url, options = {}) {
    options.method = "put";
    // options.mode = "no-cors";
    if (options.data instanceof FormData) {
      options.body = options.data;
    } else {
      if (!options.headers) {
        options.headers = {};
      }
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(options.data);
    }
    if (TokenManager.getToken()) {
      if (!options.headers) {
        options.headers = {};
      }
      options.headers["Authorization"] = TokenManager.getToken();
    }
    return this.request(url, options);
  },
  /**
   * delete请求
   * @param url
   * @param options
   * @returns {Promise<void>}
   */
  delete: async function (url, options = {}) {
    options.method = "delete";
    // options.mode = "no-cors";
    if (!options.headers) {
      options.headers = { "Content-Type": "application/json" };
    }
    if (options.headers["Content-Type"] === "multipart/form-data") {
      options.body = options.data;
    } else {
      options.headers["Content-Type"] = "application/json";
      url = url + "?" + qs.stringify(options.data, { encodeValuesOnly: true }) + "&t=" + new Date().getTime();
    }
    if (TokenManager.getToken()) {
      options.headers["Authorization"] = TokenManager.getToken();
    }
    return this.request(url, options);
  },
};

export default request;
