# Nopebot

[![Build Status](https://img.shields.io/travis/fabsrc/nopebot.svg?style=flat-square)](https://travis-ci.org/fabsrc/nopebot)
[![Dependencies](https://img.shields.io/david/fabsrc/nopebot.svg?style=flat-square)](https://david-dm.org/fabsrc/nopebot)
[![Development Dependencies](https://img.shields.io/david/dev/fabsrc/nopebot.svg?style=flat-square)](https://david-dm.org/fabsrc/nopebot?type=dev)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)


> Nope. 

*A Twitter Bot.*

## Requirements

Nopebot requires a distinct Twitter [account](https://twitter.com/signup) in order to send *nopes* to Tweets.

## Install

```bash
$ npm install
```

## Start

```bash
$ npm start
```

Nopebot requires `CONSUMER_KEY`, `CONSUMER_SECRET`, `ACCESS_TOKEN` and `ACCESS_TOKEN_SECRET` environment variables for Twitter. They can be specified in a `.env` file.

## Usage

Currently only *Twitter* is supported.

### REST

To "nopify" a tweet, the `id` of the tweet is necessary. A `POST` request can be send to the following URL:

```
http://localhost:3000/twitter/:id
```

### Twitter Direct Message

Another way to "nopify" a tweet is to send the `id` or the URL of the tweet via Twitter DM to the account of Nopebot.

## Test

```bash
$ npm test
```

## Develop

```bash
$ npm run dev
```

## License

Licensed under the [MIT License](http://opensource.org/licenses/mit-license.php).