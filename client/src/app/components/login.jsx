import { useEffect, useState } from "react"
import TextInput from "./textInput"
import { validator } from "../utils/validator"

const Login = ({ onLogin }) => {
	const [data, setData] = useState({ email: '', password: '' })
	const [errors, setErrors] = useState({})
	useEffect(() => {
		validate()
	}, [data])

	const validatorConfig = {
		email: {
			isRequired: { message: `Please enter your email` },
			isEmail: { message: 'Incorrect Email' }
		},
		password: {
			isRequired: { message: `Please enter your password` }
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
		onLogin(data)
	}

	return (
		<div className="row">
			<div className="col-md-6 offset-md-3">
				<h1 className="mb-4">Login</h1>
				<form className="border rounded border-primary p-3" onSubmit={handleSubmit} method="post">
					<TextInput label="Email" name="email" type="email" value={data.email} onChange={handleChange} error={errors.email}></TextInput>
					<TextInput label="Password" name="password" type="password" value={data.password} onChange={handleChange} error={errors.password}></TextInput>
					<button disabled={!isValid} type="submit" className="btn btn-primary">Sign in</button>
				</form>
			</div>
		</div>
	)
}

export default Login