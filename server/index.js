import mysql from 'mysql'
import express from 'express'
import cors from 'cors'
import { v4 as uuidv4 } from 'uuid'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import bcrypt from 'bcrypt'
import { Server } from 'socket.io'
import http from 'http'

const saltRounds = 10
const app = express()

app.use(cors({
	origin: 'http://localhost:3000',
	credentials: true,
}))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(session({
	key: 'userId',
	secret: 'super secret',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 1000 * 60 * 60 * 24 },
}))

const connection = mysql.createConnection({
	user: 'root',
	host: 'localhost',
	password: 'admin',
	database: 'users'
})
const server = http.createServer(app)
const io = new Server(server)

app.post('/register', (req, res) => {
	const { username, email, password, date, dateTime } = req.body
	const userId = uuidv4()

	bcrypt.hash(password, saltRounds, (error, hash) => {
		if (error) return console.log(error)

		const checkQuery = 'SELECT * FROM users WHERE email = ?'
		connection.query(checkQuery, [email], (error, results) => {
			if (error) return res.status(500).json({ error: 'Failed to register user' })
			if (results.length > 0) return res.status(409).json({ error: 'Account already exists' })

			const insertQuery = 'INSERT INTO users (id, name, email, password, registration_date, last_login, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
			connection.query(insertQuery, [userId, username, email, hash, date, dateTime, 'active'], (error, results) => {
				if (error) return res.status(500).json({ error: 'Failed to register user' })
				res.json({ message: 'User registered successfully' })
			})
		})
	})
})

app.post('/login', (req, res) => {
	const { email, password, date } = req.body
	const checkQuery = 'SELECT * FROM users WHERE email = ?'
	connection.query(checkQuery, [email], (error, results) => {
		if (error) return res.status(500).json({ error: 'Failed to process login' })
		if (results.length === 0) return res.status(401).json({ error: 'Email doesn\'t exist. Please recheck it or Sign up!' })
		if (results[0].status === 'blocked') return res.status(403).json({ error: 'You have been blocked' })

		bcrypt.compare(password, results[0].password, (error, compareResult) => {
			if (!compareResult) return res.status(401).json({ error: 'Wrong password. Try again!' })

			const updateQuery = 'UPDATE users SET last_login = ? WHERE email = ?'
			connection.query(updateQuery, [date, email], (error, result) => {
				if (error) return res.status(500).json({ error: 'login update failed' })

				req.session.userId = results[0].id
				res.send({ online: true })
			})
		})
	})
})

app.get('/login', (req, res) => {
	if (req.session.userId) {
		res.send({ online: true, user: req.session.userId })
	} else {
		res.send({ online: false })
	}
})

app.post('/logout', (req, res) => {
	req.session.destroy()
})

app.get('/table', (req, res) => {
	const query = 'SELECT id, name, email, registration_date, last_login, status FROM users;'
	connection.query(query, (error, result) => {
		if (error) { return res.status(500).json({ error: 'failed get query' }) }
		res.json(result)
	})
})

app.post('/delete', (req, res) => {
	const userIDs = req.body
	const conditions = `id=${userIDs.map(id => id = `'${id}'`).join(' OR id=')}`
	const query = `DELETE FROM users WHERE ${conditions}`
	connection.query(query, (error, result) => {
		if (error) return res.status(500).json({ error: 'failed to delete users' })

		connection.query('SELECT id, name, email, registration_date, last_login, status FROM users;', (error, result) => {
			if (error) { return res.status(500).json({ error: 'failed to get table from database' }) }
			io.emit('tableUpdate', result)
			res.json(result)
		})
	})
})

const status = { lock: 'blocked', unlock: 'active' }
Object.entries(status).forEach(status => {
	const [action, newStatus] = status
	app.post(`/${action}`, (req, res) => {
		const userIDs = req.body
		const conditions = `id=${userIDs.map(id => id = `'${id}'`).join(' OR id=')}`
		const query = `UPDATE users SET status='${newStatus}' WHERE ${conditions};`
		connection.query(query, (error, result) => {
			if (error) { return res.status(500).json({ error: 'failed to update user status ' }) }
			connection.query('SELECT id, name, email, registration_date, last_login, status FROM users;', (error, result) => {
				if (error) { return res.status(500).json({ error: 'failed to get table from database' }) }
				io.emit('tableUpdate', result)
				res.json(result)
			})
		})
	})
})

server.listen(process.env.PORT || 3301, () => {
	console.log('running server')
})