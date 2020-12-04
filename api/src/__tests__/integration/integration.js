/* istanbul ignore file */

const supertest = require('supertest')
const http = require('http');

const tempApp = require('../../index.js')
const request = supertest(tempApp)

describe('test question endpoint', () => {
  test('if no input resolves', async (done) => {
    const response = await request.post('/question').send({})
    expect(response.status).toBe(400)
    done();
  })

  test('if bad input resolves', async (done) => {
    const response = await request.post('/question').send({ q: "Don't do this to me" })
    expect(response.status).toBe(400)

    done();
  })

  test('if good input resolves', async (done) => {
    const response = await request.post('/question').send({ question: "You are evil" })
    expect(response.body.emoji).toBe(":(")
    done();
  })


  test('if bad input resolves', async (done) => {
    const response = await request.post('/question').send({ question: "Don't do this to me" })
    expect(response.body.emoji).toBe(":)")

    done();
  })


})