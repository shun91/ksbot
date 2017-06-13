const request = require('sync-request');

module.exports = {
  dialogue: (utt) => {
    const url = 'https://api.apigw.smt.docomo.ne.jp/dialogue/v1/dialogue';
    const options = {
      qs: {
        APIKEY: process.env.DIALOGUE_APIKEY
      },
      json: {
        utt: utt
      }
    };
    const res = request('POST', url, options);
    if (res.statusCode !== 200) return '何言ってるか理解できなかったお...';
    return JSON.parse(res.getBody()).utt;
  }
}
