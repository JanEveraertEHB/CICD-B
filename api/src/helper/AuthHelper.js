module.exports = helpers = {
  userIsLoggedIn: function (req, res, next) {
    if (req.headers.Authorisation) {
      //fetch user
      //add to res
      next()
    }
    res.send(400)
  }
}
