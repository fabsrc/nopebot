import test from 'ava'
import nock from 'nock'
import request from 'supertest'
import app from './server'

nock('https://api.twitter.com/1.1/statuses')
  .get('/show/0000000000.json')
  .reply(200, { id: '0000000000', user: { screen_name: 'test_user' } })
  .post('/update.json?status=%40test_user%20Nope.&in_reply_to_status_id=0000000000')
  .reply(201, { 'message': 'Nope.' })

test.skip.cb('nope was posted', t => {
  request(app)
    .post('/twitter/0000000000')
    .end((err, res) => {
      console.log(res)
      t.ifError(err)
      t.pass()
      t.end()
    })
})
