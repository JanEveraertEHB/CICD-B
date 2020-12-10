/* istanbul ignore file */

const supertestETE = require('supertest')
const httpETE = require('http');

const tempAppETE = require('../../index.js')
const requestETE = supertestETE(tempAppETE)

const DatabaseHelperETE = require('./../../helper/DatabaseHelper')

let ETE_uuid;
let token = "";

describe('test end-to-end', () => {
  test('if register resolves', async (done) => {
    response = await requestETE.post('/register').send({ email: "test@test.be", username: "test", password: "pass" })
    expect(response.status).toBe(200)
    done();
  })

  test('if login resolves', async (done) => {
    response = await requestETE.post('/login').send({ email: "test@test.be", password: "pass" })
    expect(response.status).toBe(200)
    token = response.text
    done();
  })

  test('if post request succeeds', async (done) => {
    const response = await requestETE.post('/question').set("Authorization", token).send({ "question": "are you evil" })
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
      const response = await requestETE.get(`/question/${ETE_uuid}`).set("Authorization", token).send()
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty("uuid")
      expect(response.body).toHaveProperty("answer")
      expect(response.body).toHaveProperty("question")
      done();
    })

    test('if patch request succeeds', async (done) => {
      const response = await requestETE.patch(`/question/${ETE_uuid}`).set("Authorization", token).send({ question: "altered question" })
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
      const response = await requestETE.get(`/question/${ETE_uuid}`).set("Authorization", token).send()
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty("uuid")
      expect(response.body).toHaveProperty("question", "altered question")
      expect(response.body).toHaveProperty("answer")
      done();
    })

    test('if delete request succeeds', async (done) => {
      const response = await requestETE.delete(`/question/${ETE_uuid}`).set("Authorization", token).send()
      expect(response.status).toBe(200)
      done();
    })

    test('if record is deleted', async (done) => {
      const repoonse = await DatabaseHelperETE.select('*').table('records').where({ uuid: ETE_uuid })
      expect(repoonse.length).toBe(0);
      done()
    })

    test('if get request fails after delete', async (done) => {
      const response = await requestETE.get(`/question/${ETE_uuid}`).set("Authorization", token).send()
      expect(response.status).toBe(404)
      done();
    })
  }

  //remove account
  //check if all is gone
  //try login in agauin

})
