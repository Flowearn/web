import { createAction } from "@reduxjs/toolkit"
import ActionType from "@/redux/actions/index"

const setPurchasePrice = createAction(ActionType.SET_PURCHASE_PRICE)

export { setPurchasePrice }