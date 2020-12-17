
/* istanbul ignore file */

const supertest = require('supertest')
const http = require('http');

const tempApp = require('../../index.js')
const request = supertest(tempApp)
const DatabaseHelperETE = require('../../helper/DatabaseHelper')
let ETE_uuid;

describe('test question endpoint', () => {

  let token = "";
  test('if register resolves', async (done) => {
    let response = await request.post('/register').send({ question: "Don't do this to me" })
    expect(response.status).toBe(400)
    response = await request.post('/register').send({ email: "Don't do this to me", password: "pass" })
    expect(response.status).toBe(400)
    response = await request.post('/register').send({ email: "test@test.be", username: "test", password: "pass" })
    expect(response.status).toBe(200)
    done();
  })

  test('if login resolves', async (done) => {
    let response = await request.post('/login').send({ question: "Don't do this to me" })
    expect(response.status).toBe(400)
    response = await request.post('/login').send({ email: "Don't do this to me", password: "pass" })
    expect(response.status).toBe(400)
    response = await request.post('/login').send({ email: "te@test.be", password: "pass" })
    expect(response.status).toBe(401)
    response = await request.post('/login').send({ email: "test@test.be", password: "pass" })
    expect(response.status).toBe(200)
    token = response.text
    done();
  })

  test('if no input resolves', async (done) => {
    const response = await request.post('/question').set("Authorization", token).send({})
    expect(response.status).toBe(400)
    done();
  })

  test('if bad input resolves', async (done) => {
    const response = await request.post('/question').set("Authorization", token).send({ q: "Don't do this to me" })
    expect(response.status).toBe(400)

    done();
  })

  test('if good input resolves', async (done) => {
    const response = await request.post('/question').set("Authorization", token).send({ question: "You are evil" })
    expect(response.body.emoji).toBe(":(")
    done();
  })


  test('if bad input resolves', async (done) => {
    const response = await request.post('/question').set("Authorization", token).send({ question: "Don't do this to me" })
    expect(response.body.emoji).toBe(":)")

    done();
  })





})

describe('test end-to-end', () => {
  test('db starts', async (done) => {
    done();
  })
  test('if register resolves', async (done) => {

    response = await request.post('/register').send({ email: "test@test.be", username: "test", password: "pass" })
    expect(response.status).toBe(200)
    done();
  })

  test('if login resolves', async (done) => {
    response = await request.post('/login').send({ email: "test@test.be", password: "pass" })
    expect(response.status).toBe(200)
    token = response.text
    done();
  })

  test('if post request succeeds', async (done) => {
    const response = await request.post('/question').set("Authorization", token).send({ "question": "are you evil" })
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("uuid")
    expect(response.body).toHaveProperty("emoji", ":(")

    ETE_uuid = response.body.uuid
    done();
  })
  if (ETE_uuid) {
    test('if record exists', async (done) => {
      const reponse = await DatabaseHelperETE.select('*').table('records').where({ uuid: ETE_uuid })
      expect(reponse.length).toBeGreaterThan(0);
      expect(reponse[0]).toHaveProperty('uuid', ETE_uuid);
      expect(reponse[0]).toHaveProperty('answer', "-3");
      expect(reponse[0]).toHaveProperty('question', "are you evil");
      done()
    })


    test('if get request succeeds', async (done) => {
      const response = await request.get(`/question/${ETE_uuid}`).set("Authorization", token).send()
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty("uuid")
      expect(response.body).toHaveProperty("answer")
      expect(response.body).toHaveProperty("question")
      done();
    })

    test('if patch request succeeds', async (done) => {
      const response = await request.patch(`/question/${ETE_uuid}`).set("Authorization", token).send({ question: "altered question" })
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty("uuid")
      expect(response.body).toHaveProperty("question", "altered question")
      done();
    })

    test('if record is adapted', async (done) => {
      const reponse = await DatabaseHelperETE.select('*').table('records').where({ uuid: ETE_uuid })
      expect(reponse.length).toBeGreaterThan(0);
      expect(reponse[0]).toHaveProperty('question', "altered question");
      done()
    })



    test('if get request succeeds after alter', async (done) => {
      const response = await request.get(`/question/${ETE_uuid}`).set("Authorization", token).send()
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty("uuid")
      expect(response.body).toHaveProperty("question", "altered question")
      expect(response.body).toHaveProperty("answer")
      done();
    })

    test('if delete request succeeds', async (done) => {
      const response = await request.delete(`/question/${ETE_uuid}`).set("Authorization", token).send()
      expect(response.status).toBe(200)
      done();
    })

    test('if record is deleted', async (done) => {
      const repoonse = await DatabaseHelperETE.select('*').table('records').where({ uuid: ETE_uuid })
      expect(repoonse.length).toBe(0);
      done()
    })

    test('if get request fails after delete', async (done) => {
      const response = await request.get(`/question/${ETE_uuid}`).set("Authorization", token).send()
      expect(response.status).toBe(404)
      done();
    })
  }

  afterAll(async (done) => {
    await DatabaseHelperETE.destroy()
    done();
  })
})
