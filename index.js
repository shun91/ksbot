'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const util = require('./src/util');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// 雑談対話APIのcontext
let context = null;

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  const img_str = ['画像', 'image', 'img'];
  if (event.message.text.match(new RegExp(img_str.join('|')))) {
    const url = util.ImgSearch.fetchUrlRandom(event.message.text);
    console.log(url);
    return client.replyMessage(event.replyToken, {
      'type': 'image',
      'originalContentUrl': url,
      'previewImageUrl': url
    });
  }

  // 雑談対話APIを叩く
  const dialogue = util.dialogue(event.message.text, context);

  // context更新
  context = dialogue.context;

  // create a echoing text message
  const echo = { type: 'text', text: dialogue.text };

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
