import { useSelector } from "react-redux"
import React from "react"


const Notification = () => {
	const notification = useSelector(state => state.notification)
	const style = {
		border: "solid",
		padding: 10,
		borderWidth: 1
	}
	const hidden = {
		display: "none",
		border: "solid",
		padding: 10,
		borderWidth: 1
	}
	return (
		<div style={notification!=="" ? style : hidden}>
			{notification}
		</div>
	)
}

export default Notification

