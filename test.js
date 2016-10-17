import test from 'ava'
import nock from 'nock'
import request from 'supertest'
import app from './server'

nock('https://api.twitter.com/1.1/statuses')
  .get('/show/787986487409254400.json')
  .reply(200, { id: '787986487409254400', user: { screen_name: 'test_user' } })
  .post('/update.json?status=%40test_user%20Nope.&in_reply_to_status_id=787986487409254400')
  .reply(403, { 'message': 'nope' })

test.skip.cb('status is a duplicate', t => {
  request(app)
    .post('/twitter/787986487409254400')
    .end((err, res) => {
      console.log(err, res)
      t.ifError(err)
      t.fail()
      t.end()
    })
})
