/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-01-11 11:51:08
 * @LastEditors: chenhua
 * @LastEditTime: 2024-02-06 16:39:56
 */
import ActionType from "@/redux/actions"
import { createReducer } from "@reduxjs/toolkit"

const initialState = {
	balanceCoin: ""
}

const balanceReducer = createReducer(initialState, builder => {
	builder
		.addCase(ActionType.SET_BALANCE, (state, action) => {
			state.balanceCoin = action.payload
		})
		.addDefaultCase((state, action) => {})
})

export default balanceReducer;
