import { createAction } from "@reduxjs/toolkit"
import ActionType from "@/redux/actions/index"

const setConnectWallet = createAction(ActionType.SET_CONNECT_WALLET)

export { setConnectWallet }