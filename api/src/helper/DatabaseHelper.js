
let db = require('knex')({
  client: 'pg',
  // connection: {
  // host: process.env.POSTGRES_HOST || '127.0.0.1',
  // user: process.env.POSTGRES_USER || 'example',
  // password: process.env.POSTGRES_PASSWORD || 'example',
  // database: process.env.POSTGRES_DB || 'test'

  // user: "doadmin",
  // password: "qyouu9w2md8wud3b",
  // host: "test-students-do-user-2476832-0.b.db.ondigitalocean.com",
  // port: 25060,
  // database: "defaultdb",
  // sslmode: "require"

  // },

  connection: "postgresql://doadmin:show-password@private-test-students-do-user-2476832-0.b.db.ondigitalocean.com:25060/defaultdb?sslmode=require",
  pool: {
    min: 0,
    max: 7,
    createTimeoutMillis: 3000,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 100,
    propagateCreateError: false // <- default is true, set to false 
  }
});


module.exports = db