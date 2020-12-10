/* istanbul ignore file */

const supertest = require('supertest')
const http = require('http');

const tempApp = require('../../index.js')
const request = supertest(tempApp)

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