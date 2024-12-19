/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-01-05 17:27:08
 * @LastEditors: chenhua
 * @LastEditTime: 2024-03-06 15:29:11
 */
/**
 * description：token manager
 * @author Kevin
 * @date 2022/3/11
 */

const tokenKey = "cat_token"
const expirationTimeKey = "expiration_time"
const providerType = "provider_type"

const TokenManager = {
	setToken: function (token) {
		localStorage.setItem(tokenKey, token)
	},
	setExpirationTime: function (expiration_time) {
		localStorage.setItem(expirationTimeKey, expiration_time)
	},
	setProviderType: function (type) {
		localStorage.setItem(providerType, type)
	},
	getToken: function () {
		return localStorage.getItem(tokenKey)
	},
	getExpirationTime: function () {
		return localStorage.getItem(expirationTimeKey)
	},
	getProviderType: function () {
		return localStorage.getItem(providerType)
	},
	removeToken: function () {
		localStorage.removeItem(tokenKey)
	},
	removeUserInfo: function () {
		localStorage.removeItem('userInfo')
	},
	removeAll: function () {
		localStorage.clear()
	}
}

export default TokenManager
