import { Navigate, useLocation } from "react-router-dom"

const RequireNoAuth = ({ children, isLogged }) => {
	const location = useLocation()

	if (isLogged) return <Navigate to='/' state={{ from: location }} />

	return children
}

export default RequireNoAuth