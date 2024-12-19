/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-01-11 11:51:08
 * @LastEditors: chenhua
 * @LastEditTime: 2024-08-26 10:44:12
 */
import ActionType from "@/redux/actions"
import { createReducer } from "@reduxjs/toolkit"

const initialState = {
	nickName: ""
}

const nickNameReducer = createReducer(initialState, builder => {
	builder
		.addCase(ActionType.SET_NICK_NAME, (state, action) => {
			state.nickName = action.payload
		})
		.addDefaultCase((state, action) => {})
})

export default nickNameReducer;
