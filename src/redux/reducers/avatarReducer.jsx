/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-01-11 11:51:08
 * @LastEditors: chenhua
 * @LastEditTime: 2024-08-26 11:12:20
 */
import ActionType from "@/redux/actions"
import { createReducer } from "@reduxjs/toolkit"

const initialState = {
	avatarUrl: ""
}

const avatarReducer = createReducer(initialState, builder => {
	builder
		.addCase(ActionType.SET_AVATAR, (state, action) => {
			state.avatarUrl = action.payload
		})
		.addDefaultCase((state, action) => {})
})

export default avatarReducer;
