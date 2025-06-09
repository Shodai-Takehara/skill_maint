# SkillMaint - 製造設備保守管理システム

スキルベースの製造設備保守管理システム

## 🏗️ アーキテクチャ

このプロジェクトは[Feature-Sliced Design (FSD)](https://feature-sliced.design/)アーキテクチャを採用しています。

### ディレクトリ構造

```
src/
├── app/              # アプリケーション層
├── views/            # ビュー層（ページ）
├── widgets/          # ウィジェット層
├── features/         # フィーチャー層
├── entities/         # エンティティ層
└── shared/           # 共有層
```

詳細は[CLAUDE.md](./CLAUDE.md)を参照してください。

## 🚀 セットアップ

### 必要な環境

- Node.js 20.x 以上
- npm 9.x 以上

### インストール

```bash
# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env.local
```

### 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) でアプリケーションが起動します。

## 📝 利用可能なスクリプト

```bash
# 開発サーバー
npm run dev

# プロダクションビルド
npm run build

# プロダクションサーバー
npm start

# コード品質チェック
npm run lint
npm run lint:fix
npm run format
npm run format:check
npm run type-check
```

## 🛠️ 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **UIコンポーネント**: shadcn/ui
- **状態管理**: Zustand (予定)
- **フォーム**: React Hook Form + Zod
- **リンター**: ESLint + Prettier

## 📂 主な機能

- 📊 **ダッシュボード**: 保守状況の概要表示
- 🏭 **設備管理**: 設備情報の管理
- 📋 **作業指示**: 保守作業の管理
- 👥 **チーム管理**: 技術者情報の管理
- 🎯 **スキル管理**: 技術者のスキル管理

## 🤝 開発ガイドライン

1. コミット前に必ず `npm run lint` と `npm run type-check` を実行
2. FSDアーキテクチャの層間依存ルールを遵守
3. コンポーネントは対応するディレクトリに配置
4. インポートは定められた順序に従う

## 📄 ライセンス

プライベートプロジェクト