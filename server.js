require('dotenv').config({ silent: true })
const express = require('express')
const Twit = require('twit')
const _ = require('lodash')

const app = module.exports = express()
const T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
})

const nopeMedia = [
  '788024486545293312',
  '788028055801438209',
  '788028457481596928'
]

const stream = T.stream('user')

stream.on('direct_message', ({ direct_message: dm }) => {
  nope(dm.text)
    .then(({ data: tweet }) => {
      T.post('direct_messages/new', {
        user_id: dm.sender.id,
        text: `https://twitter.com/nope_bot/status/${tweet.id_str}`
      })
    })
    .catch(console.error)
})

app.post('/twitter/:id', (req, res) => {
  nope(req.params.id)
    .then(tweet => {
      if (!tweet.errors) {
        console.log(tweet)
        res.status(201).send('Created Nope!')
      } else {
        res.status(500).send('Server Error!')
      }
    })
    .catch(err => {
      console.error('ERR', err)
      res.status(500).send('500 ' + err)
    })
})

function nope (id) {
  return T.get('statuses/show/:id', { id })
    .then(({ data: tweet }) => {
      if (tweet.errors) throw new Error('No tweet with this id found!')

      return T.post('statuses/update', {
        status: `@${tweet.user.screen_name} Nope.`,
        media_ids: _.sample(nopeMedia),
        in_reply_to_status_id: tweet.id
      }).then(({ data: tweet }) => {
        if (tweet.errors) throw new Error('Duplicate Tweet!')

        return tweet
      })
    })
}

if (!module.parent) {
  app.listen(3000, function () { console.log(`Nopebot listening on port ${this.address().port}`) })
}
