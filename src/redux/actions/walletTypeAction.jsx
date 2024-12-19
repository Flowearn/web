import { createAction } from "@reduxjs/toolkit"
import ActionType from "@/redux/actions/index"

const setWalletType= createAction(ActionType.SET_WALLET_TYPE)

export { setWalletType }