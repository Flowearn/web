/**
 * 描述：项目app相关的 reducer的集合，如需要，可以继续拆分
 * @authorchenhua
 * @date 2021/12/15
 */
import { combineReducers } from "redux"
import { createReducer, current } from "@reduxjs/toolkit"
import ActionType from "@redux/actions"

let initialState = {
	//app版本
	versionName: "",
	//用户id
	userId: "",
	//用户token
	token: "",
	//全局配置
	configs: {},
	theme: "rgb(24, 144, 255)",
	mode: "side",
	algorithm: "light",
	role: "superuser"
}
/**
 * 更新用户user的reducer
 * @param state
 * @param action
 * @returns {{configs: {}, versionName: string, userId: string, token: string}}
 */
const userReducer = (state = initialState, action) => {
	return { ...state }
}

/**
 * 更新项目配置reducer
 */
export const configReducer = createReducer(initialState, builder => {
	builder
		.addCase(ActionType.SET_THEME, (state, action) => {
			state.theme = action.payload
		})
		.addCase(ActionType.SET_MODE, (state, action) => {
			state.mode = action.payload
		})
		.addCase(ActionType.SET_ALGORITHM, (state, action) => {
			state.algorithm = action.payload
		})
		.addDefaultCase((state, action) => {})
})

const appReducer = combineReducers({
	userReducer,
	configReducer
})

export default appReducer
