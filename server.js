const mongoose = require('mongoose')
const express = require('express')
const Twit = require('twit')
require('dotenv').config()

const app = module.exports = express()
const T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
})

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/nope')
const NopeTweet = mongoose.model('NopeTweet', {})
const stream = T.stream('user')

T.get('account/verify_credentials', { skip_status: true, include_entities: false, include_email: false })
  .then(({ data: user }) => {
    T.user = user
  })

stream.on('direct_message', ({ direct_message: dm }) => {
  if (T.user && T.user.id_str === dm.recipient_id_str) {
    let statusId

    if (isNaN(dm.text) && dm.entities.urls) {
      dm.entities.urls.forEach(u => {
        statusId = u.expanded_url.match(/http(s)?:\/\/(www\.)?twitter\.com\/[A-Za-z0-9_]+\/status\/(\d+)/)[3]
      })
    } else {
      statusId = dm.text
    }

    nope(statusId)
      .then(tweet => {
        T.post('direct_messages/new', {
          user_id: dm.sender.id,
          text: `https://twitter.com/${tweet.user.id_str}/status/${tweet.id_str}`
        })
      })
      .catch(err => {
        console.error(err)
        T.post('direct_messages/new', {
          user_id: dm.sender.id,
          text: String(err)
        })
      })
  }
})

app.post('/twitter/:id', (req, res) => {
  nope(req.params.id)
    .then(tweet => {
      if (!tweet.errors) {
        res.status(201).send(tweet)
      } else {
        res.status(500).send('Server Error!')
      }
    })
    .catch(err => {
      console.error(err)
      res.status(500).send('500 ' + err)
    })
})

function nope (id) {
  let newNopeTweet

  return T.get('statuses/show/:id', { id })
    .then(({ data: tweet }) => {
      if (tweet.errors) {
        console.error(tweet.errors)

        tweet.errors.forEach(({ message: err }) => {
          throw new Error(err)
        })
      } else {
        newNopeTweet = new NopeTweet(tweet, false)

        return T.post('statuses/update', {
          status: `@${tweet.user.screen_name} Nope.`,
          in_reply_to_status_id: tweet.id_str
        })
      }
    })
    .then(({ data: tweet }) => {
      if (tweet.errors) {
        console.error(tweet.errors)

        tweet.errors.forEach(({ message: err }) => {
          throw new Error(err)
        })
      }

      newNopeTweet.set('nope', tweet)
      newNopeTweet.save()

      return tweet
    })
}

if (!module.parent) {
  app.listen(process.env.PORT || 3000, function () {
    console.log(`Nopebot listening on port ${this.address().port}`)
  })
}
