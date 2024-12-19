/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-01-03 19:12:29
 * @LastEditors: chenhua
 * @LastEditTime: 2024-08-26 10:47:04
 */
/**
 * 描述： 所有reducer的入口
 * @authorchenhua
 * @date 2021/12/13
 */

import { combineReducers } from "redux";
//路由的reducer
import {routerReducer} from "./routerReducer";
import monitorReducerEnhancer from "./monitorReducer";
// import apiReducer from "./apiReducer";
import appReducer from "./appReducer";
import purchaseReducer from "./purchaseReducer";
import balanceReducer from "./balanceReducer";
import avatarReducer from "./avatarReducer";
import connectWalletReducer from "./connectWalletReducer";
import walletTypeReducer from "./walletTypeReducer";
import chatMsgReducer from "./chatMsgReducer";
import nickNameReducer from "./nickNameReducer";

/**
 * 应用启动时永远加载的 reducer，保存的项目相关的reducer
 * @type {{appReducer: {}}}
 */
const staticReducers = {
	appReducer,
}

const rootReducers = combineReducers({
	...staticReducers,
	// monitor 的reducer
	// monitorReducerEnhancer,
	// 路由的reducer
	routerReducer,
	purchaseReducer,
	balanceReducer,
	avatarReducer,
	connectWalletReducer,
	walletTypeReducer,
	chatMsgReducer,
	nickNameReducer
	// 请求相关 reducer
	// apiReducer,
	// UI相关reducer
	// screenReducer
})

export default rootReducers;