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




  test('if bad input resolves', async (done) => {
    let response = await request.post('/register').send({ email: "Don't do this to me" })
    expect(response.status).toBe(400)
    response = await request.post('/register').send({})
    expect(response.status).toBe(400)
    response = await request.post('/register').send({ email: "email", password: "pas" })
    expect(response.status).toBe(400)
    response = await request.post('/register').send({ email: "test@test.be", password: "password" })
    expect(response.status).toBe(200)

    done();
  })

  test('if bad input resolves', async (done) => {
    let response = await request.post('/login').send({ email: "Don't do this to me" })
    expect(response.status).toBe(400)
    response = await request.post('/login').send({})
    expect(response.status).toBe(400)
    response = await request.post('/login').send({ email: "email", password: "pas" })
    expect(response.status).toBe(400)
    response = await request.post('/login').send({ email: "test@test.be", password: "password" })
    expect(response.status).toBe(200)
    expect(response.body).toBe('eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJ1dWlkIjoiMTMzYjNkZjAtM2FjNS0xMWViLTg0ODEtYWI1OTlkMTIwNzVmIiwiZW1haWwiOiJ0ZXN0QHRlc3QuYmUiLCJyb2xlcyI6bnVsbH0.f-iia706Nlj7cO8m1eMjc7iVIS-XVemR4bBGdBbnjfpeSKu3RslVkC6fhvVLOdkCbmhHvTr_UKlTIjiNaZbrXQ')
    done();
  })


})