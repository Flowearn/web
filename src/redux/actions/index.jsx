/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-07-11 16:56:44
 * @LastEditors: chenhua
 * @LastEditTime: 2024-08-26 10:42:52
 */

/**
 * 描述： 所有 action 的入口(官方推荐所有actions 集中管理起来)
 * @author chenhua
 * @date 2021/12/13
 */

const ActionType = {
	ADD_ROUTER: "ADD_ROUTER",
	REMOVE_ROUTER: "REMOVE_ROUTER",
	SET_CURRENT_ROUTER: "SET_CURRENT_ROUTER",
	// 设置主题
	SET_THEME: "SET_THEME",
	// 设置布局mode
	SET_MODE: "SET_MODE",
	// 设置夜间模式
	SET_ALGORITHM: "SET_ALGORITHM",
	SET_PURCHASE_PRICE: 'SET_PURCHASE_PRICE',
	SET_BALANCE: 'SET_BALANCE',
	SET_AVATAR: 'SET_AVATAR',
	SET_CONNECT_WALLET: 'SET_CONNECT_WALLET',
	SET_WALLET_TYPE: 'SET_WALLET_TYPE',
	SET_CHAT_MSG: 'SET_CHAT_MSG',
	SET_NICK_NAME: 'SET_NICK_NAME',
}

export default ActionType
