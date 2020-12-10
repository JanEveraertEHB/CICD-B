const jwtTokens = require('jsontokens');
const DatabaseHelper = require('./DatabaseHelper');

const AuthHelper = {
  tokenValidator: async function (req, res, next) {
    if (req.headers.authorization) {
      const payload = jwtTokens.decodeToken(req.headers.authorization)
      if (payload.payload.uuid) {
        await DatabaseHelper.table('users').select('*').where({ uuid: payload.payload.uuid, email: payload.payload.email }).then((data) => {
          // encrypt into id token
          if (data.length == 0) {
            res.status(401).send()
          }
          req.body = {
            ...req.body,
            user: data[0]
          }
          next()
        });
      }
      else {
        res.status(401).send()
      }
    }
    else {
      res.status(401).send()
    }
  }
}

module.exports = AuthHelper;