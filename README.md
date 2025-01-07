<p align="center">
<img src="./img/logo.png" alt="logo">
<a href="https://github.com/hosokawa-kenshin/latin_one">商品注文アプリケーション</a>のバックエンドサーバプログラム
</p>
<p align="center">
<img src="https://img.shields.io/badge/NestJS-blue?color=ef5350&logo=nestjs&style=flat-square">
<img src="https://img.shields.io/badge/-Firebase-ef5350.svg?logo=firebase&style=flat-square">
<a href="https://github.com/hosokawa-kenshin/Gcal.js/blob/main/README-ja.md">
    <img height="20px" src="https://img.shields.io/badge/JA-flag.svg?color=45b8cd&style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA5MDAgNjAwIj4NCjxwYXRoIGZpbGw9IiNmZmYiIGQ9Im0wLDBoOTAwdjYwMGgtOTAweiIvPg0KPGNpcmNsZSBmaWxsPSIjYmUwMDI2IiBjeD0iNDUwIiBjeT0iMzAwIiByPSIxODAiLz4NCjwvc3ZnPg0K">
  </a>
<img alt="GitHub License" src="https://img.shields.io/github/license/hosokawa-kenshin/latin_one_server?style=flat-square&logoColor=45b8cd&color=45b8cd">
<br>
</p>

<p>
<p align="center">
<a href="https://github.com/hosokawa-kenshin/latin_one_server" target="__blank"><img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/hosokawa-kenshin/latin_one_server?logoColor=black"></a>
</p>

<p align="center">
  <a href="##Requirements">Requirements</a> •
  <a href="##Setup">Setup</a> •
  <a href="##Compile and Run">Compile and Run</a> •
  <a href="##License">License</a>
</p>

## Requirements

1. Node.js v20.x.x

## Setup
1. プロジェクトの依存関係をインストール
```bash
$ npm install
```

2. serviceAccountKey.json をディレクトリ直下に配置
- Firebaseサービスアカウントの認証情報を含む JSON ファイルを Firebase コンソールからダウンロードし，serviceAccountKey.json に改名してディレクトリ直下に配置する．

3. .env ファイルに LINE Messaging API を使用するための認証情報を記述
```bash
cp .env.example .env
vim .env
```

## Compile and Run
```bash
$ npm run start
```

サーバを起動した後，ウェブブラウザで `http://localhost:4000` にアクセスすることで管理コンソールを利用


## License

LatinOne is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
