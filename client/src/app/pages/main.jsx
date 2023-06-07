import { useState, useEffect } from "react"
import Table from "../components/table"
import Toolbar from "../components/toolbar"
import io from 'socket.io-client'

const Main = ({ logOut }) => {
	const [data, setData] = useState()
	const [selectedUsers, setSelectedUsers] = useState([])
	const [socket, setSocket] = useState(null)

	useEffect(() => {
		fetch('http://localhost:3301/table')
			.then(response => { if (response.ok) return response.json() })
			.then(actualData => {
				setData(actualData)
			})

		const socket = io('http://localhost:3301', { transports: ['websocket'] })
		setSocket(socket)
		socket.on('tableUpdate', (updatedData) => {
			setData(updatedData)
			const activeUsers = updatedData.filter(user => user['status'] === 'active').map(user => user = user['email'])
			if (!activeUsers.includes(localStorage.getItem('user'))) logOut()
		})


		return () => {
			socket.off('tableUpdate')
		}
	}, [])

	const handleAction = (action) => {
		selectedUsers.length === 0 ? console.error('no chosen users')
			: fetch(`http://localhost:3301/${action}`, { method: 'post', body: JSON.stringify(selectedUsers), headers: { 'Content-Type': 'application/json' } })
				.then(response => response.ok ? response.json() : console.log(response))
				.then(actualData => {
					socket.emit('tableUpdate', actualData)
					setSelectedUsers([])
					setData(actualData)
				})
	}
	const handleSelect = ({ target }) => {
		if (target.id === 'common-check') return selectAll(target.checked)
		if (target.checked) return setSelectedUsers(prevState => [...prevState, target.id])
		else {
			document.getElementById('common-check').checked = false
			return setSelectedUsers(prevState => prevState.filter((userId) => userId !== target.id))
		}
	}
	const selectAll = (checked) => {
		const allUsers = data.map(user => user = user['id'])
		checked ? setSelectedUsers(allUsers) : setSelectedUsers([])
	}

	return (
		<>
			<Toolbar onAction={handleAction} someSelected={selectedUsers.length > 0} />
			<Table data={data} onSelect={handleSelect} selectedUsers={selectedUsers} />
		</>
	)
}

export default Main