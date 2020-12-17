let fs = require('fs')
let db = require('knex')({
  client: 'pg',
  connection: {
    user: "doadmin",
    password: "qyouu9w2md8wud3b",
    host: "test-students-do-user-2476832-0.b.db.ondigitalocean.com",
    port: 25060,
    database: "defaultdb",
    charset: 'utf8',
    ssl: {
      ca: fs.readFileSync(__dirname + '/certs/ca-certificate.crt', 'ascii'),
    },

  },

  pool: {
    min: 2,
    max: 50,
    "idleTimeoutMillis": 30000,
    "createTimeoutMillis": 30000,
    "acquireTimeoutMillis": 30000,
    propagateCreateError: true
  }
});


module.exports = db