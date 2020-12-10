const jwtTokens = require('jsontokens')
const DatabaseHelper = require('./DatabaseHelper')

const AuthHelper = {
  tokenValidator: async (req, res, next) => {
    if (req.headers.authorization || req.headers.Authorization) {
      const jwtRegex = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
      const header = req.headers.authorization;
      if (jwtRegex.test(header)) {
        const jwt = jwtTokens.decodeToken(req.headers.authorization)
        const user = {
          ...jwt.payload
        }
        await DatabaseHelper.table('users').select('*').where(user).then((data) => {
          if (data.length > 0) {
            req.body = {
              ...req.body,
              user: data[0]
            }
            next()
          }
          else {
            res.status(401).send({ e: "no valid header present" })
          }
        })
          .catch((e) => {
            res.status(401).send({ e: "no valid header present" })
          })
      }
      else {
        res.status(401).send({ e: "no valid header present" })
      }
    }
    else {
      res.status(401).send({ e: " no header present" })
    }
  }
}

module.exports = AuthHelper;