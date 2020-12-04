const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const ConversationHelpers = require('./helper/ConversationHelpers');
const AuthHelpers = require('./helper/AuthHelper');
const DatabaseHelper = require('./helper/DatabaseHelper');
const UUIDHelper = require('./helper/UuidHelpers');

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

/**
* 
*/
app.post('/question', AuthHelpers.userIsLoggedIn, async (req, res) => {
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

app.get('/questions', async (req, res) => {
  await DatabaseHelper.table('records').select('*').then((data) => {
    res.send(data);
  }).catch((error) => {
    res.send(error).status(400)
  })
})

app.get('/question/:uuid', async (req, res) => {
  if (req.params.uuid && db !== null) {
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

app.patch('/question/:uuid', async (req, res) => {
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
app.delete('/question/:uuid', async (req, res) => {
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
  app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));
}

module.exports = app