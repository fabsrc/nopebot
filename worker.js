const mongoose = require('mongoose')
const fetch = require('node-fetch')
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/nope')
mongoose.Promise = global.Promise
const NopeTweet = mongoose.model('NopeTweet', {})
let tweets = []

NopeTweet
  .find()
  .then(items => {
    tweets = items
    const originalCheck = items.map(item => item._doc.id_str && fetch(`https://twitter.com/anyuser/status/${item._doc.id_str}`) || {})
    const nopeCheck = items.map(item => item._doc.nope && fetch(`https://twitter.com/anyuser/status/${item._doc.nope.id_str}`) || {})
    return Promise.all([Promise.all(originalCheck), Promise.all(nopeCheck)])
  })
  .then(items => {
    let [originalCheck, nopeCheck] = items

    originalCheck.forEach((item, idx) => {
      if (item.status === 404 || nopeCheck[idx].status === 404) {
        console.log(`Remove ${tweets[idx]._doc.id_str}`)
        tweets[idx].remove()
      }
    })
    mongoose.connection.close()
  })
  .catch(err => console.error(err))
