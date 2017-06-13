# ksbot
LINE bot.

## 使い方

依存パッケージのインストール
```sh
$ npm i
```

環境変数として下記を設定する。
```sh
$ export CHANNEL_SECRET=YOUR_CHANNEL_SECRET
$ export CHANNEL_ACCESS_TOKEN=YOUR_CHANNEL_ACCESS_TOKEN
$ export DIALOGUE_APIKEY=YOUR_DIALOGUE_APIKEY
```

下記コマンドで実行できる。
```sh
$ node index.js
```

## TODO
- 雑談対話API：contextなど導入
- 画像検索機能
- スタンプ投稿されたときのレスポンス考える
- グループトークへの対応
