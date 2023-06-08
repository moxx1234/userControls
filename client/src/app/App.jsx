import { Routes, Route, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Layout from './pages/layout'
import Login from './components/login'
import Register from './components/registration'
import Main from './pages/main'
import RequireAuth from './hoc/requireAuth'
import RequireNoAuth from './hoc/requireNoAuth'

function App() {
	const [isLogged, setIsLogged] = useState(localStorage.getItem('user') !== null)
	const navigate = useNavigate()

	const getDate = () => {
		let date = new Date()
		const year = date.toLocaleString('default', { year: 'numeric' })
		const month = date.toLocaleString('default', { month: '2-digit' })
		const day = date.toLocaleString('default', { day: '2-digit' })
		const time = date.toLocaleTimeString()
		date = [year, month, day].join('-')
		const dateTime = `${[year, month, day].join('-')} ${time}`
		return { date: date, dateTime: dateTime }
	}
	const logIn = (userEmail, status = 'active') => {
		if (status === 'blocked') alert('Someone has blocked you :(')
		localStorage.setItem("user", userEmail)
		setIsLogged(true)
		navigate('/', { replace: true })
	}
	const logOut = () => {
		fetch('https://userserver-n296.onrender.com/logout', { credentials: 'include', method: 'post' })
		localStorage.removeItem('user')
		setIsLogged(false)
	}

	const handleLogin = (userInfo) => {
		userInfo.date = getDate().dateTime
		const dataJSON = JSON.stringify(userInfo)
		fetch('https://userserver-n296.onrender.com/login', { method: 'post', body: dataJSON, headers: { 'Content-Type': 'application/json' }, credentials: 'include' })
			.then(response => {
				if (response.ok) {
					logIn(userInfo.email, userInfo.status)
				}
				if (response.status === 500) {
					alert('Something went wrong :(')
					document.location.reload()
				} else if (response.status === 401) {
					response.json().then(result => alert(result.error))
				} else if (response.status === 403) {
					response.json().then(result => alert(result.error))
				}
			})
	}
	const handleRegister = (userInfo) => {
		const dateObj = getDate()
		userInfo.date = dateObj.date
		userInfo.dateTime = dateObj.dateTime
		const dataJSON = JSON.stringify(userInfo)
		fetch('https://userserver-n296.onrender.com/register', { method: 'post', body: dataJSON, headers: { 'Content-Type': 'application/json' } })
			.then(response => {
				if (response.ok) {
					logIn(userInfo.email)
				}
				if (response.status === 409) alert('Account exists. Please log in')
				else if (response.status === 500) {
					alert('Something went wrong :(')
					document.location.reload()
				}
			})
	}

	return (
		<>
			<Routes>
				<Route path="/" element={<Layout isLogged={isLogged} onLogout={logOut} />}>
					<Route index element={
						<RequireAuth isLogged={isLogged}>
							<Main logOut={logOut} />
						</RequireAuth>
					} />
					<Route path='login' element={
						<RequireNoAuth isLogged={isLogged}>
							<Login onLogin={handleLogin} />
						</RequireNoAuth>
					} />
					<Route path="register" element={
						<RequireNoAuth isLogged={isLogged}>
							<Register onRegister={handleRegister} />
						</RequireNoAuth>
					} />
				</Route>
			</Routes>
		</>
	)
}

export default App
