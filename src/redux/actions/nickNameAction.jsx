import { createAction } from "@reduxjs/toolkit"
import ActionType from "@/redux/actions/index"

const setNickName = createAction(ActionType.SET_NICK_NAME)

export { setNickName }