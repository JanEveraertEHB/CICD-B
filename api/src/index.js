const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const md5 = require('md5')
const jwtToken = require('jsontokens')


const ConversationHelpers = require('./helper/ConversationHelpers');
const AuthHelper = require('./helper/AuthHelper');
const DatabaseHelper = require('./helper/DatabaseHelper');
const UUIDHelper = require('./helper/UuidHelpers');
const { generateUUID } = require('./helper/UuidHelpers');
const { await } = require('./helper/wordList');

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

//133b3df0-3ac5-11eb-8481-ab599d12075f

app.get('/join', async (req, res) => {
  await DatabaseHelper
    .table('records')
    .join('users', DatabaseHelper.raw('users.uuid::varchar'), 'records.user_id')
    .select('records.*', 'users.email')
    .then((data) => {
      res.send(data)
    })

})

app.get('/questions', async (req, res) => {
  await DatabaseHelper.table('records').select('*').then((data) => {
    res.send(data);
  }).catch((error) => {
    res.send(error).status(400)
  })
})

app.get('/question/:uuid', async (req, res) => {
  if (req.params.uuid) {
    await DatabaseHelper.table('records').select('*').where({ uuid: req.params.uuid }).then((data) => {
      if (data.length > 0) {
        res.send(data[0]);
      }
      else {
        // could not find
        res.sendStatus(404)
      }
    }).catch((error) => {
      res.send(error).status(400)
    })
  }
  else {
    res.send(400)
  }
})

app.post('/register', async (req, res) => {
  const userData = req.body;
  if (userData && userData.email && userData.password) {
    //check if user email validf
    const regex = /^\S+@\S+\.\S+$/
    if (regex.test(userData.email)) {
      const pwd = md5(userData.password);
      const uuid = UUIDHelper.generateUUID();
      const toInsert = {
        uuid,
        email: userData.email,
        password: pwd
      };
      await DatabaseHelper.table('users').insert(toInsert).returning('*').then((data) => {
        res.send(data)
      })
        .catch((e) => {
          res.status(401).send(e)
        })
    }
    else {
      res.status(400).send()
    }
  }
  else {
    res.status(400).send()
  }
})



app.post('/login', async (req, res) => {
  const userData = req.body;
  if (userData && userData.email && userData.password) {
    //check if user email validf
    const regex = /^\S+@\S+\.\S+$/
    if (regex.test(userData.email)) {
      const pwd = md5(userData.password);


      await DatabaseHelper.table('users').select(['uuid', 'email', 'roles']).where({ email: userData.email, password: pwd }).then((data) => {
        // encrypt into id token
        if (data.length == 0) {
          res.status(400).send()
        }
        else {
          const jwt = new jwtToken.TokenSigner('ES256K', process.env.PRIVATE_KEY).sign(data[0])
          res.send(jwt)

        }
      })
        .catch((e) => {
          console.log(e)
          res.status(401).send(e)
        })
    }
    else {
      res.status(400).send()
    }
  }
  else {
    res.status(400).send()
  }
})

/**
* 
*/
app.post('/question', AuthHelper.tokenValidator, async (req, res) => {
  const question = req.body.question;
  const response = await ConversationHelpers.senseEmotionHelper(question)
  const uuid = UUIDHelper.generateUUID();
  if (response) {
    const toInsertQuestion = {
      uuid: uuid,
      question: question,
      answer: response.toString()
    }
    await DatabaseHelper.insert(toInsertQuestion).table('records').returning('*').then(async (data) => {
      if (response == null) {
        res.sendStatus(400)
      }
      else {
        const answer = { ...ConversationHelpers.convertEmotionValue(response), uuid: uuid };
        res.send(answer);
      }
    }).catch((e) => {
      res.status(400).send(e)
    })
  }
  else {
    res.status(400).send()
  }
})


app.patch('/question/:uuid', AuthHelper.tokenValidator, async (req, res) => {
  if (req.params.uuid && req.body) {
    const toAlter = {};
    if (req.body.question) {
      toAlter["question"] = req.body.question;
    }
    await DatabaseHelper.table('records').update(toAlter).where({ uuid: req.params.uuid }).returning('*').then((data) => {
      if (data.length > 0) {
        res.status(200).send(data[0]);
      }
      else {
        res.status(404).send();
      }
    }).catch((error) => {
      res.status(403).send(error)
    })
  }
  else {
    res.sendStatus(400)
  }
})
app.delete('/question/:uuid', AuthHelper.tokenValidator, async (req, res) => {
  if (req.params.uuid) {
    await DatabaseHelper.table('records').delete().where({ uuid: req.params.uuid }).returning('*').then((data) => {
      if (data.length > 0) {
        res.sendStatus(200);
      }
      else {
        res.sendStatus(404);
      }
    }).catch((error) => {
      res.send(error).status(400)
    })
  }
  else {
    res.send(400)
  }
})

if (process.env.NODE_ENV !== 'test') {
  app.listen(process.env.PORT || 3000, () => console.log(`Listening on port ${process.env.PORT || 3000}`));
}

module.exports = app