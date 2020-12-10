
let db = require('knex')({
  client: 'pg',
  connection: {
    host: process.env.POSTGRES_HOST || '127.0.0.1',
    user: process.env.POSTGRES_USER || 'example',
    password: process.env.POSTGRES_PASSWORD || 'example',
    database: process.env.POSTGRES_DB || 'test'
  },
});

module.exports = db