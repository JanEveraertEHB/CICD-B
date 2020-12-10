const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const md5 = require('md5');
const jwtToken = require('jsontokens')


const ConversationHelpers = require('./helper/ConversationHelpers');
const DatabaseHelper = require('./helper/DatabaseHelper');
const InitialiseDBHelpers = require('./helper/InitialiseDBHelpers')
const UUIDHelper = require('./helper/UuidHelpers');
const AuthHelper = require('./helper/AuthHelper');

InitialiseDBHelpers.initialiseTables(DatabaseHelper);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.post('/login', async (req, res) => {
  const uData = req.body;
  if (uData && uData.password && uData.email) {
    const regex = /^\S+@\S+\.\S+$/;
    if (regex.test(uData.email)) {
      const toMatch = {
        email: uData.email,
        password: md5(uData.password)
      }
      await DatabaseHelper.table('users').select(['uuid', 'username', 'email']).where(toMatch).then((data) => {
        if (data.length == 0) {
          res.status(401).send()
        }
        else {

          jwt = new jwtToken.TokenSigner('ES256K', "private key").sign(data[0])
          res.status(200).send(jwt)

        }
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



app.post('/register', async (req, res) => {
  const uData = req.body;
  if (uData && uData.username && uData.password && uData.email) {
    const regex = /^\S+@\S+\.\S+$/;
    if (regex.test(uData.email)) {
      // insert
      const toInsert = {
        uuid: UUIDHelper.generateUUID(),
        username: uData.username,
        email: uData.email,
        password: md5(uData.password)
      }
      await DatabaseHelper.table('users').insert(toInsert).then((data) => {
        res.status(200).send()
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



app.get('/join', async (req, res) => {
  await DatabaseHelper
    .table('items')
    .join('lists', DatabaseHelper.raw('item.uuid::varchar'), 'lists.item_id')
    .select('lists.*', 'items.*')
    .then((data) => {
      res.send(data)
    })

})

app.get('/questions', AuthHelper.tokenValidator, async (req, res) => {
  await DatabaseHelper.table('records').select('*').where({ user_id: req.body.user.uuid }).then((data) => {
    res.send(data);
  }).catch((error) => {
    res.send(error).status(400)
  })
})

app.get('/question/:uuid', AuthHelper.tokenValidator, async (req, res) => {
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
      answer: response.toString(),
      user_id: req.body.user.uuid
    }
    await DatabaseHelper.insert(toInsertQuestion).table('records').returning('*').then(async (data) => {
      if (response == null) {
        res.sendStatus(402)
      }
      else {
        const answer = { ...ConversationHelpers.convertEmotionValue(response), uuid: uuid };
        res.send(answer);
      }
    }).catch((e) => {
      res.status(401).send(e)
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