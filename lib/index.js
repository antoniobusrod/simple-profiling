const http = require('http')
const crypto = require('crypto')
const express = require('express')
const auth = require('./auth')
const users = require('./users')

const app = express()
app.get('/', (req, res) => res.send({ ok: true }))
app.get('/newUser', (req, res) => {
  let username = req.query.username || ''
  const password = req.query.password || ''
  username = username.replace(/[!@#$%^&*]/g, '')
  if (!username || !password || users.get(username)) {
    return res.status(400).end()
  }

  const salt = crypto.randomBytes(128).toString('base64')
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512')
  users.set(username, { salt, hash })
  res.status(200).end()
})
app.get('/auth', auth.sync)
// app.get('/auth', auth.async)
const server = http.createServer(app)
const port = 4000
server.listen(port, `127.0.0.1`, () => console.log(`Server listening on port ${port}`))

