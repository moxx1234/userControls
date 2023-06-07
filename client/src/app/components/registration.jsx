import { useEffect, useState } from "react"
import TextInput from "./textInput"
import { validator } from "../utils/validator"

const Register = ({ onRegister }) => {
	const [data, setData] = useState({ username: '', email: '', password: '', passwordRepeat: '' })
	const [errors, setErrors] = useState({})
	useEffect(() => {
		validate()
	}, [data])

	const validatorConfig = {
		username: {
			isRequired: { message: `Please enter your username` }
		},
		email: {
			isRequired: { message: `Please enter your email` },
			isEmail: { message: 'Incorrect Email' }
		},
		password: {
			isRequired: { message: `Please enter your password` }
		},
		passwordRepeat: {
			isRequired: { message: `Please enter your password` },
			isPasswordMatch: { message: 'Passwords don\'t match' }
		}
	}

	const validate = () => {
		const errors = validator(data, validatorConfig)
		setErrors(errors)
		return Object.keys(errors).length === 0
	}
	const isValid = Object.keys(errors).length === 0

	const handleChange = (e) => {
		setData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }))
		validate()
	}
	const handleSubmit = (e) => {
		e.preventDefault()
		const isValid = validate()
		if (!isValid) return
		const { passwordRepeat, ...rest } = data
		onRegister(rest)
	}

	return (
		<div className="row">
			<div className="col-md-6 offset-md-3">
				<h1 className="mb-4">Register</h1>
				<form className="border rounded border-primary p-3" onSubmit={handleSubmit} method="post">
					<TextInput
						label="Username"
						name="username"
						type="text"
						value={data.username}
						onChange={handleChange}
						error={errors.username}
					/>
					<TextInput
						label="Email"
						name="email"
						type="email"
						value={data.email}
						onChange={handleChange}
						error={errors.email}
					/>
					<TextInput
						label="Password"
						name="password"
						type="password"
						value={data.password}
						onChange={handleChange}
						error={errors.password}
					/>
					<TextInput
						label="Repeat password"
						name="passwordRepeat"
						type="password"
						value={data.passwordRepeat}
						onChange={handleChange}
						error={errors.passwordRepeat}
					/>
					<button disabled={!isValid} type="submit" className="btn btn-primary">Sign Up</button>
				</form>
			</div>
		</div>
	)
}

export default Register