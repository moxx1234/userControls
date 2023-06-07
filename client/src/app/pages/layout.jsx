import { Outlet, NavLink } from 'react-router-dom'

const Layout = ({ isLogged, onLogout }) => {

	return (
		<>
			<header>
				{isLogged ? (
					<nav className="nav">
						<NavLink className='nav-link' onClick={onLogout} to="/">Log out</NavLink>
					</nav>
				) : (
					<nav className="nav">
						<NavLink className={navData => navData.isActive ? 'nav-link disabled' : 'nav-link'} to="/login">Login</NavLink>
						<NavLink className={navData => navData.isActive ? 'nav-link disabled' : 'nav-link'} to="/register">Sign Up</NavLink>
					</nav>
				)}

			</header>
			<main className='container mt-3'>
				<Outlet />
			</main>
		</>
	)
}

export default Layout