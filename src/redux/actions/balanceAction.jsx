import { createAction } from "@reduxjs/toolkit"
import ActionType from "@/redux/actions/index"

const setBalanceCoin = createAction(ActionType.SET_BALANCE)

export { setBalanceCoin }