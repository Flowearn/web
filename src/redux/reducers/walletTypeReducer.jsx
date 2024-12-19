/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-06-13 11:45:37
 * @LastEditors: chenhua
 * @LastEditTime: 2024-06-13 11:46:49
 */
import ActionType from "@/redux/actions"
import { createReducer } from "@reduxjs/toolkit"

const initialState = {
	walletType: ""
}

const walletTypeReducer = createReducer(initialState, builder => {
	builder
		.addCase(ActionType.SET_WALLET_TYPE, (state, action) => {
			state.walletType = action.payload
		})
		.addDefaultCase((state, action) => {})
})

export default walletTypeReducer;