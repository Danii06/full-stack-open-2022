import { configureStore } from "@reduxjs/toolkit"
import anecdoteReducer from "./reducers/anecdoteReducer"
import filterReducer from "./reducers/filterReducer"
import notificationReducer from "./reducers/notificationReducer"
import timerReducer from "./reducers/timerReducer"

const store = configureStore({
	reducer: {
		anecdotes: anecdoteReducer,
		notification: notificationReducer,
		timer: timerReducer,
		filter: filterReducer
	}
})

export default store