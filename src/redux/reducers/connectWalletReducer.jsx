/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-01-11 11:51:08
 * @LastEditors: chenhua
 * @LastEditTime: 2024-04-17 19:15:49
 */
import ActionType from "@/redux/actions"
import { createReducer } from "@reduxjs/toolkit"

const initialState = {
	connectWallet: false
}

const connectWalletReducer = createReducer(initialState, builder => {
	builder
		.addCase(ActionType.SET_CONNECT_WALLET, (state, action) => {
			state.connectWallet = action.payload
		})
		.addDefaultCase((state, action) => {})
})

export default connectWalletReducer;
