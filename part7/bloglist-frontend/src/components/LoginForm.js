import PropTypes from "prop-types"
import React, { useState, useEffect } from "react"
import { Box } from "@mui/system"
import ToggleIcon from "material-ui-toggle-icon"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined"
import { TextField } from "@mui/material"
import useSound from "use-sound"
import Button from "@mui/material/Button"

const LoginForm = (props) => {
	const [unlock, setUnlock] = useState(false)
	const [slideOut, setSlideOut] = useState(false)
	const [slideIn, setSlideIn] = useState(true)
	const [left, setLeft] = useState(-50)

	const [sound, { stop, isPlaying }] = useSound("/sounds/lock.wav", {
		playbackRate: 1.3,
		volume: 2,
	})
	if (props.destroy && !isPlaying && !unlock) {
		sound()
		setTimeout(() => {
			setUnlock(true)
			setTimeout(() => {
				setSlideOut(true)
			}, 500)
		}, 500)
	}

	useEffect(() => {
		if (!slideOut) return
		const timer = window.setInterval(() => {
			setLeft(left - 2)
			if (left < -1000) {
				setSlideOut(false)
			}
		}, 1000 / 120)
		return () => {
			window.clearInterval(timer)
		}
	}, [slideOut, left, setLeft])

	useEffect(() => {
		if (!slideIn) return
		const timer = window.setInterval(() => {
			setLeft(left + 2)
			if (left === 50) {
				setSlideIn(false)
			}
		}, 1000 / 120)
		return () => {
			window.clearInterval(timer)
		}
	}, [slideIn, left, setLeft])

	return (
		<div>
			<Box
				sx={{
					position: "absolute",
					top: "50%",
					left: left + "%",
					transform: "translate(-50%, -50%) scale(22);",
					zIndex: 0,
				}}
			>
				<ToggleIcon
					on={!unlock}
					onIcon={<LockOutlinedIcon />}
					offIcon={<LockOpenOutlinedIcon />}
				/>
			</Box>
			<Box
				sx={{
					position: "absolute",
					top: "50%",
					left: left + "%",
					transform: "translate(-50%, -40%)",
					background: "white",
				}}
			>
				<form onSubmit={props.onSubmit}>
					<div>
						<TextField
							fullWidth
							label="Username"
							margin="normal"
							type="text"
							name="username"
							id="username"
						/>
					</div>
					<div>
						<TextField
							fullWidth
							label="Password"
							margin="normal"
							type="password"
							name="password"
							id="password"
						/>
					</div>
					<div>
						<Button fullWidth margin="normal" type="submit" id="loginbutton">
							Login
						</Button>
					</div>
				</form>
			</Box>
		</div>
	)
}

LoginForm.propTypes = {
	onSubmit: PropTypes.func.isRequired,
}

export default LoginForm
