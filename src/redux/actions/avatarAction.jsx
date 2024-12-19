import { createAction } from "@reduxjs/toolkit"
import ActionType from "@/redux/actions/index"

const setAvatarUrl = createAction(ActionType.SET_AVATAR)

export { setAvatarUrl }