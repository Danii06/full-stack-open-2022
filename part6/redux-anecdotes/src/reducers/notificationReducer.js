import { createSlice } from "@reduxjs/toolkit"
import { setTimer } from "./timerReducer"





const notificationSlice = createSlice({
	name: "notification",
	initialState: "",
	reducers: {
		sendNotifcation(state,action){
			return action.payload
		}
	}
})

const sendTimedNotifcation = (message, duration) => {
	return async dispatch => {
		dispatch(sendNotifcation(message))
		dispatch(setTimer(setTimeout(()=>{dispatch(sendNotifcation(""))}, duration)))
	}
}

export {sendTimedNotifcation}
export const {sendNotifcation} = notificationSlice.actions
export default notificationSlice.reducer