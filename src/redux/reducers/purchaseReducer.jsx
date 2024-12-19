/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-01-11 11:51:08
 * @LastEditors: chenhua
 * @LastEditTime: 2024-02-01 14:31:31
 */
import ActionType from "@/redux/actions"
import { createReducer } from "@reduxjs/toolkit"

const initialState = {
	priceObj: {}
}

const purchaseReducer = createReducer(initialState, builder => {
	builder
		.addCase(ActionType.SET_PURCHASE_PRICE, (state, action) => {
			state.priceObj = action.payload
		})
		.addDefaultCase((state, action) => {})
})

export default purchaseReducer;
