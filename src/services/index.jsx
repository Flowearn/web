/*
 * @description: 首页
 * @author: chenhua
 * @Date: 2022-12-14 10:34:12
 * @LastEditors: chenhua
 * @LastEditTime: 2024-08-26 20:50:26
 */

import request from "@/utils/request";

/**
 * @returns {Promise<*>}
 */
export async function myPortfolio(data) {
  return request.get("/myPortfolio", {
    data,
  });
}

/**
 * @returns {Promise<*>}
 */
export async function getTokenList(data) {
  return request.get("/token", {
    data,
  });
}

/**
 * @returns {Promise<*>}
 */
export async function getPrice(data) {
  return request.get("/price", {
    data,
  });
}

/**
 * @returns {Promise<*>}
 */
export async function savePortfolio(data) {
  return request.post("/portfolio", {
    data,
  });
}

/**
 * @returns {Promise<*>}
 */
export async function getRanking(data) {
  return request.get("/ranking", {
    data,
  });
}

/**
 * @returns {Promise<*>}
 */
export async function login(data) {
  return request.post("/login", {
    data,
  });
}


/**
 * @returns {Promise<*>}
 */
export async function getMyFollowing(data) {
  return request.get("/myFollowing", {
    data,
  });
}

/**
 * @returns {Promise<*>}
 */
export async function getUserDetail(data) {
  return request.get("/userDetail", {
    data,
  });
}

/**
 * @returns {Promise<*>}
 */
// export async function getPortfolioDetail(data) {
//   return request.get("/portfolioDetail", {
//     data,
//   });
// }

/**
 * @returns {Promise<*>}
 */
export async function getPortfolioDetail(data) {
  return request.get("/tokenList", {
    data,
  });
}

/**
 * @returns {Promise<*>}
 */
export async function getMyHolders(data) {
  return request.get("/myHolders", {
    data,
  });
}

/**
 * @returns {Promise<*>}
 */
export async function pushAccount(data) {
  return request.put("/account", {
    data,
  });
}

/**
 * @returns {Promise<*>}
 */
export async function getAccountInfo(data) {
  return request.get("/account", {
    data,
  });
}

/**
 * @returns {Promise<*>}
 */
export async function getRefreshEvent(data) {
  return request.get("/refreshEvent", {
    data,
  });
}

/**
 * @returns {Promise<*>}
 */
export async function getNotification(data) {
  return request.get("/notification", {
    data,
  });
}

/**
 * @returns {Promise<*>}
 */
export async function getRecentChange(data) {
  return request.get("/recentChange", {
    data,
  });
}

/**
 * @returns {Promise<*>}
 */
export async function getDataWallet(data) {
  return request.get("/dataWallet", {
    data,
  });
}

/**
 * @returns {Promise<*>}
 */
export async function addDataWallet(data) {
  return request.post("/dataWallet", {
    data,
  });
}

/**
 * @returns {Promise<*>}
 */
export async function delDataWallet(data) {
  return request.delete("/dataWallet", {
    data,
  });
}

/**
 * @returns {Promise<*>}
 */
export async function getMyKey(data) {
  return request.get("/myKey", {
    data,
  });
}

/**
 * @returns {Promise<*>}
 */
export async function myFollowingLog(data) {
  return request.get("/myFollowingLog", {
    data,
  });
}


/**
 * @returns {Promise<*>}
 */
export async function listMinChart(data) {
  return request.post("/listMinChart", {
    data,
  });
}

/**
 * @returns {Promise<*>}
 */
export async function detailChart(data) {
  return request.get("/detailChart", {
    data,
  });
}

export async function bindTg(name) {
  return request.put(`/bindTg?username=${name}`);
}

export async function tgUrl() {
  return request.get(`/tgUrl`);
}


export async function unbindTg() {
  return request.put(`/unbindTg`);
}

export async function mainWallet(wallet_name) {
  return request.post(`/mainWallet?wallet_name=${wallet_name}`);
}
