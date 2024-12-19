import { createAction } from "@reduxjs/toolkit"
import ActionType from "@/redux/actions/index"

const setChatMsg = createAction(ActionType.SET_CHAT_MSG)

export { setChatMsg }