import { useState, forwardRef, useImperativeHandle, React } from "react"
import PropTypes from "prop-types"

const Togglable = forwardRef((props, refs) => {
	const [visible, setVisible] = useState(false)

	const hideWhenVisible = { display: visible ? "none" : "" }
	const showWhenVisible = { display: visible ? "" : "none" }

	const toggleVisibility = () => {
		setVisible(!visible)
	}

	useImperativeHandle(refs, () => {
		return {
			toggleVisibility,
		}
	})

	return (
		<div>
			<div style={hideWhenVisible}>
				<button onClick={toggleVisibility} class="showbutton">
					{props.buttonLabel}
				</button>
			</div>
			<div style={showWhenVisible}>
				{props.children}
				<button onClick={toggleVisibility} class="hidebutton">
					{props.closeButtonLabel ? props.closeButtonLabel : "cancel"}
				</button>
			</div>
		</div>
	)
})

Togglable.displayName = "Togglable"

Togglable.propTypes = {
	buttonLabel: PropTypes.string.isRequired,
	children: PropTypes.element.isRequired,
	closeButtonLabel: PropTypes.string,
}

export default Togglable
