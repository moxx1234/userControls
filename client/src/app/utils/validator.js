export const validator = (data, config) => {
	const errors = {}
	const validate = (method, fieldValue, config) => {
		switch (method) {
			case 'isRequired':
				if (fieldValue.trim() === '') return config.message
				break
			case 'isEmail':
				if (!/^\S+@\S+\.\S+$/g.test(fieldValue)) return config.message
				break
			case 'isPasswordMatch':
				if (fieldValue !== data['password']) return config.message
				break
			default:
				break
		}
	}
	for (const fieldName in data) {
		for (const validateMethod in config[fieldName]) {
			const error = validate(validateMethod, data[fieldName], config[fieldName][validateMethod])
			if (error && !errors[fieldName]) {
				errors[fieldName] = error
			}
		}
	}
	return errors
}