const crypto = require('crypto')
const users = require('./users')

exports.sync = (req, res) => {
  let username = req.query.username || ''
  const password = req.query.password || ''
  username = username.replace(/[!@#$%^&*]/g, '')
  if (!username || !password || !users.get(username)) {
    return res.status(400).end()
  }

  const hash = crypto.pbkdf2Sync(password, users.get(username).salt, 10000, 512, 'sha512')
  res.status(users.get(username).hash.toString() === hash.toString() ? 200 : 401).end()
}

exports.async = (req, res) => {
  console.error('Not implemented yet')
  res.status(500).end()
}

