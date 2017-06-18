const request = require('sync-request');
const chc     = require('cheerio-httpcli');

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

  /**
   * Y!画像検索に関する関数群
   */
  ImgSearch: {
    /**
     * 検索結果の画像へのリダイレクトURL一覧を取得
     *
     * @param {string} p クエリ
     * @return {Array.<string>} URLの配列
     */
    fetchRedirectUrls: function (p) {
      // 検索結果をスクレイピング
      const res = chc.fetchSync(
        'https://search.yahoo.co.jp/image/search',
        {p: p}
      );
      // 画像URL一覧を取得
      return res.$('a', '#gridlist').map(function(idx, elem){
        return elem.attribs.href;
      }).get();
    },

    /**
     * リダイレクトURLを画像URLに変換する
     * Y!画像検索結果をスクレイピングして得られるURLはリダイレクトURLのため、
     * 変換が必要
     *
     * @param {string} url リダイレクトURL
     * @return {string} 変換後のURL
     */
    convertImgUrl: function (url) {
      return chc.fetchSync(url).response.request.uri.href;
    },

    /**
     * Y!画像検索結果の画像URLをランダムで1枚返す
     *
     * @param {string} p クエリ
     * @return {string} URL
     */
    fetchUrlRandom: function (p) {
      const urls = this.fetchRedirectUrls(p);
      if (urls.length === 0) {
        return `「${p}」な画像は見つからなかったお、うがーーー`;
      }
      return this.convertImgUrl(urls[Math.floor(Math.random() * urls.length)]);
    },

    /**
     * Y!画像検索結果の画像URLをランダムで1枚投稿する
     *
     * @param {Array} room 部屋情報の連想配列
     * @param {Array} data streaming APIで受け取った連想配列
     * @param {string} account このアカウントへのリプライ時に画像投稿する
     */
    postUrlRandom: function (room, data, account) {
      // 指定アカウントへのリプライであるなら画像検索する
      if (data.message.indexOf('@' + account) !== -1 && data.type === 'plain') {
        // クエリを取得
        const p = data.message.replace('@' + account, '');
        // 画像検索して発言
        // メッセージは、this.fetchUrlRandom(p)
        });
      }

    }
  }
}
