import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"


const Notification = (props) => {
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
		<div style={props.notification!=="" ? style : hidden}>
			{props.notification}
		</div>
	)
}

Notification.propTypes = {
	notification: PropTypes.string.isRequired
}

function mapStateToProps(state) {
	return {
		notification: state.notification
	}
}

// eslint-disable-next-line no-unused-labels
export default connect(mapStateToProps,null)(Notification)

