# smart-img-cropper

サムネ表示する画像を人物の顔を中心にトリミングし表示する機能テスト

## ディレクトリ・ファイル構成

```txt
├ generateImageList.cjs    src/assets/imagesの画像ファイル名のリストをjsonに出力する
├ public
│ └ models/                顔検出の学習モデル
├ src
  ├ components
  └ assets/
    ├ images/              画像ファイル
    └ imageList.json       画像ファイルのリスト
```

## 顔検出ライブラリ

### [@vladmandic/face-api](https://github.com/vladmandic/face-api/tree/master)

[face-api.js](https://github.com/justadudewhohacks/face-api.js) の後継。Typescript に対応
