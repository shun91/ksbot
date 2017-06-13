const request = require('sync-request');

module.exports = {
  dialogue: (utt, context) => {
    const url = 'https://api.apigw.smt.docomo.ne.jp/dialogue/v1/dialogue';
    const options = {
      qs: {
        APIKEY: process.env.DIALOGUE_APIKEY
      },
      json: {
        utt: utt,
        context: context
      }
    };
    const res = request('POST', url, options);
    if (res.statusCode !== 200) return '何言ってるか理解できなかったお...';
    const body = JSON.parse(res.getBody());
    return {
      text: body.utt,
      context: body.context
    };
  }
}
