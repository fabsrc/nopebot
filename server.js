require('dotenv').config({ silent: true })
const express = require('express')
const Twit = require('twit')

const app = module.exports = express()
const T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
})

app.post('/twitter/:id', (req, res) => {
  T.get('statuses/show/:id', { id: req.params.id }, (err, tweet, response) => {
    if (err) {
      console.error(err)
      res.status(404).send('No tweet found for this id.')
    } else if (tweet) {
      T.post('statuses/update', {
        status: `@${tweet.user.screen_name} Nope.`,
        in_reply_to_status_id: tweet.id
      }, (err, data, response) => {
        if (err) {
          console.error(err)
          res.sendStatus(500)
        } else {
          console.log(data)
          res.send(tweet.id + ' - ' + tweet.user.screen_name + ': ' + tweet.text)
        }
      })
    }
  })
})

if (!module.parent) {
  app.listen(3000, function () { console.log(`Nopebot listening on port ${this.address().port}`) })
}
