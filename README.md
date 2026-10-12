# 夜カフェ＆バー 雫（しずく） — 店舗サイト Sample

架空の「夜カフェ＆バー」を想定した、飲食店の公式サイト（1ページ構成）のコーディングサンプルです。
店名・住所・電話番号・メニュー・お知らせなどはすべて架空のものです。

## 使用技術

- HTML5（WAI-ARIA）
- Sass（SCSS）… 設定・ベース・共通パーツ・セクションごとにファイル分割、BEM命名
- JavaScript（バニラJS、ライブラリ不使用）

## 実装内容

- 夜の雰囲気に合わせたダークトーンのデザイン、明朝体の見出しとイタリックの欧文の組み合わせ
- 現在時刻から営業状況を自動表示（営業中／本日19:00 OPEN／定休日）
- 時間帯ごとの過ごし方（Cafe Time / Bar Time / Late Night）を紹介するセクション
- メニューのタブ切り替え（`role="tablist"`、矢印キー・Home/Endキー対応）
- ギャラリーのライトボックス（`<dialog>` 要素、前後送り・Escで閉じる・閉じた後はフォーカスを戻す）
- お知らせ一覧・Instagram導線（WordPress化する場合は投稿一覧と連動させる想定）
- 席の予約フォーム
  - 入力チェック（未入力・電話番号の桁数）
  - Web予約は前日まで、火曜（定休日）は選択時にエラー表示
- Googleマップの埋め込み（CSSフィルターでダークな配色になじませています）
- 構造化データ（JSON-LD：`CafeOrCoffeeShop`）で店舗情報・営業時間を記述
- タブレット・スマートフォン用の全画面メニュー、SP用の追従ボタン（予約・メニュー）
- スクロールに合わせたフェードイン（JSが無効な環境では最初から表示）
- `prefers-reduced-motion` への配慮

※サンプルのため、フォームの内容は送信されず、お知らせ・Instagramのリンク先はありません。
※地図は徳島駅周辺を表示しています。

## Sassのコンパイル

```bash
npm install
npx sass scss/style.scss css/style.css --style=expanded --no-source-map
```

## 写真について

写真はすべて [Unsplash](https://unsplash.com/) のものを使用しています（Unsplash License）。

Ambitious Studio* / Oliver Guhr / Jake Buonemani / Kevin Butz / Pylyp Sukhenko / Tina Guina / Robbie Down / Kenneth Running / Timothy James / Louis Hansel / Adli Hadiyan Munif / Ash Edmonds / Yosuke Ota / Dylan de Jonge / Dave Weatherall / Jordan Merrick / Patrick Fore / Lex Sirikiat / Hanxiao Xu / Med Wael Laraiedh / willy wong / Tu Ngoc Minh / Pete Willis
