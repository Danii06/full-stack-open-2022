import { createSlice } from "@reduxjs/toolkit"





const timerSlice = createSlice({
	name: "timer",
	initialState: null,
	reducers: {
		setTimer(state,action){
			clearTimeout(state)
			return action.payload
		}
	}
})

export const {setTimer} = timerSlice.actions
export default timerSlice.reducer