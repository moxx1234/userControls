import { useState } from "react"
import { BsEye, BsEyeSlash } from "react-icons/bs"

const TextInput = ({ label, name, type, onChange, value, error }) => {
	const [showPassword, setShowPassword] = useState(false)
	const getInputClasses = () => {
		return `form-control ${error ? 'is-invalid' : ''}`
	}
	const toggleShowPassword = () => {
		setShowPassword(prevState => !prevState)
	}
	return (
		<div className="mb-3">
			<label htmlFor={name} className="form-label">{label}</label>
			<div className="input-group has-validation">
				<input className={getInputClasses()}
					onChange={onChange}
					value={value}
					type={showPassword ? 'text' : type}
					name={name}
					id={name} />
				{type === 'password' &&
					<button
						className="btn btn-outline-secondary"
						type="button"
						onClick={toggleShowPassword}
					>
						{!showPassword ? <BsEye /> : <BsEyeSlash />}
					</button>}
				{error && <div className="invalid-feedback">{error}</div>}
			</div>

		</div>
	)
}
export default TextInput