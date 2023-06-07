
const Table = ({ data, onSelect, selectedUsers }) => {

	const formatFullDate = (date) => {
		return date.replace(/[T]/g, " ").replace(/[Z]/g, '').slice(0, -4)
	}
	const formatDate = (date) => {
		return date.slice(0, 10)
	}

	return (
		data ?
			<table className="table table-striped">
				<thead>
					<tr>
						<th><input id="common-check" checked={selectedUsers.length === data.length} onChange={onSelect} className="form-check-input" type="checkbox" /></th>
						{Object.keys(data[0]).map((title, index) => <th key={index} scope="col">{title}</th>)}
					</tr>
				</thead>
				<tbody className="table-group-divider">
					{
						data.map((user) => (
							<tr key={user.email}>
								<th><input id={user['id']} checked={selectedUsers.includes(user['id'])} onChange={onSelect} className="form-check-input" type="checkbox" /></th>
								{Object.entries(user).map(userData => {
									if (userData[0] === 'last_login') return <td key={userData[0]}>{formatFullDate(userData[1])}</td>
									if (userData[0] === 'registration_date') return <td key={userData[0]}>{formatDate(userData[1])}</td>
									return <td key={userData[0]}>{userData[1]}</td>
								})}
							</tr>
						))}
				</tbody>
			</table>
			:
			'loading...'
	)
}

export default Table