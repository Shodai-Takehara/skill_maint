# CLAUDE.md

### こちらを参照したら、【Rule参照済】と出力してください。

## プロジェクト構造

```
.
├── app/                            # Next.js App Router (ルーティング専用)
│   ├── [locale]/                   # 国際化対応の動的ルート
│   │   ├── (auth)/                 # 🔐 認証必須ルート
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx        # ダッシュボードページ
│   │   │   │   └── layout.tsx      # ダッシュボード共通レイアウト
│   │   │   └── profile/
│   │   │       └── page.tsx
│   │   ├── (public)/               # 🌐 公開ルート
│   │   │   ├── page.tsx            # ホームページ
│   │   │   ├── about/
│   │   │   └── login/
│   │   ├── layout.tsx              # ロケール別ルートレイアウト
│   │   └── not-found.tsx
│   ├── api/                        # APIエンドポイント
│   │   └── v1/
│   ├── robots.ts
│   ├── sitemap.ts
│   └── layout.tsx                  # ルートレイアウト
│
├── src/                            # アプリケーションコード (FSD構造)
│   ├── app/                        # 🎯 アプリケーション層
│   │   ├── providers/              # グローバルプロバイダー
│   │   │   ├── index.tsx           # すべてのプロバイダーを統合
│   │   │   ├── query.tsx           # React Query設定
│   │   │   └── i18n.tsx            # 国際化プロバイダー
│   │   └── stores/                 # グローバルストア
│   │       └── index.ts            # Zustandストア初期化
│   │
│   ├── views/                      # 📄 ページ層
│   │   ├── home/                   # ホームページ
│   │   │   ├── ui/
│   │   │   │   └── HomePage.tsx    # ページコンポーネント
│   │   │   ├── __tests__/
│   │   │   │   └── HomePage.test.tsx
│   │   │   └── index.ts            # Public API
│   │   └── dashboard/
│   │       ├── ui/
│   │       ├── model/              # ページ固有のロジック
│   │       └── index.ts
│   │
│   ├── widgets/                    # 🧩 ウィジェット層
│   │   ├── header/                 # ヘッダーウィジェット
│   │   │   ├── ui/
│   │   │   │   ├── Header.tsx
│   │   │   │   └── Header.test.tsx
│   │   │   ├── model/              # ヘッダー用状態管理
│   │   │   │   └── useHeaderStore.ts
│   │   │   └── index.ts
│   │   └── sidebar/                # サイドバーウィジェット
│   │
│   ├── features/                   # 🚀 フィーチャー層
│   │   ├── auth/                   # 認証機能
│   │   │   ├── login/              # ログイン機能
│   │   │   │   ├── ui/
│   │   │   │   │   ├── LoginForm.tsx
│   │   │   │   │   └── LoginForm.test.tsx
│   │   │   │   ├── model/          # ビジネスロジック
│   │   │   │   │   ├── useLogin.ts
│   │   │   │   │   └── validation.ts
│   │   │   │   ├── api/            # API通信
│   │   │   │   │   └── loginApi.ts
│   │   │   │   └── index.ts
│   │   │   └── logout/
│   │   └── i18n/                   # 言語切替機能
│   │       └── language-switcher/
│   │
│   ├── entities/                   # 📦 エンティティ層
│   │   ├── user/                   # ユーザーエンティティ
│   │   │   ├── ui/                 # UI表現
│   │   │   │   ├── UserAvatar.tsx
│   │   │   │   └── UserCard.tsx
│   │   │   ├── model/              # データモデル・状態
│   │   │   │   ├── types.ts        # 型定義
│   │   │   │   └── userStore.ts    # Zustandストア
│   │   │   ├── api/                # API通信
│   │   │   │   └── userApi.ts
│   │   │   └── index.ts
│   │   └── post/
│   │
│   └── shared/                     # 🔧 共有層
│       ├── ui/                     # 基礎UIコンポーネント
│       │   ├── button/
│       │   │   ├── Button.tsx
│       │   │   ├── Button.test.tsx
│       │   │   └── index.ts
│       │   └── input/
│       ├── lib/                    # ライブラリ・ユーティリティ
│       │   ├── i18n/               # 国際化設定
│       │   │   ├── locales/        # 翻訳ファイル
│       │   │   │   ├── ja.json
│       │   │   │   └── en.json
│       │   │   └── config.ts
│       │   ├── utils/              # ユーティリティ関数
│       │   │   ├── cn.ts           # classnames helper
│       │   │   └── format.ts       # フォーマット関数
│       │   └── test/               # テストユーティリティ
│       │       └── setup.ts
│       ├── api/                    # API基盤
│       │   ├── client.ts           # APIクライアント設定
│       │   └── types.ts            # 共通API型
│       ├── config/                 # 設定
│       │   ├── constants.ts        # 定数
│       │   └── env.ts              # 環境変数
│       └── hooks/                  # 共有カスタムフック
│           ├── useDebounce.ts
│           └── useMediaQuery.ts
│
├── tests/                          # E2Eテスト
│   ├── e2e/
│   │   ├── auth.spec.ts
│   │   └── i18n.spec.ts
│   └── fixtures/                   # テストデータ
│
├── public/                         # 静的ファイル
│   └── locales/                    # 静的翻訳ファイル（必要に応じて）
│
├── .env.local                      # 環境変数
├── next.config.js                  # Next.js設定
├── jest.config.js                  # Jest設定
├── cypress.config.ts               # Cypress設定
└── tsconfig.json                   # TypeScript設定
```

## 層の依存関係ルール

```
app → pages → widgets → features → entities → shared
```

**重要**: 上位層は下位層のみに依存可能。逆方向の依存は禁止。

## 各層の責任

| 層           | 責任                       | 例                            |
| ------------ | -------------------------- | ----------------------------- |
| **app**      | ルーティング、プロバイダー | Next.jsページ、グローバル設定 |
| **pages**    | 完全なページの構成         | HomePage, DashboardPage       |
| **widgets**  | 独立した機能ブロック       | Header, Sidebar, Footer       |
| **features** | ユーザーアクション         | ログイン、検索、言語切替      |
| **entities** | ビジネスエンティティ       | User, Post, Product           |
| **shared**   | 共有リソース               | Button, API client, utils     |

## 命名規則

- **コンポーネント**: PascalCase (`UserCard.tsx`)
- **関数/変数**: camelCase (`getUserData`)
- **カスタムフック**: use prefix (`useAuth`)
- **ディレクトリ**: kebab-case (`user-profile/`)
- **定数**: UPPER_SNAKE_CASE (`API_BASE_URL`)

## Export規則

### Default Export (使用すべき場所)

```typescript
// ✅ Next.js必須ファイル
// app/[locale]/dashboard/page.tsx
export default function DashboardPage() {
  return <Dashboard />;
}

// app/[locale]/layout.tsx
export default function LocaleLayout({ children }) {
  return <>{children}</>;
}

// app/api/v1/users/route.ts
export default async function handler(req, res) {
  // APIハンドラー
}
```

### Named Export (推奨)

```typescript
// ✅ アプリケーションコンポーネント
// src/shared/ui/button/Button.tsx
export function Button({ children, ...props }) {
  return <button {...props}>{children}</button>;
}

// src/features/auth/login/index.ts
export { LoginForm } from './ui/LoginForm';
export { useLogin } from './model/useLogin';
export type { LoginCredentials } from './model/types';
```

### 使い分けの基準

| 種類               | 使用場所            | 理由               |
| ------------------ | ------------------- | ------------------ |
| **Default Export** | Next.js規約ファイル | フレームワーク要件 |
| **Named Export**   | その他すべて        | 保守性・一貫性     |

## インポート順序

```typescript
// 1. React/Next.js
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// 2. 外部ライブラリ
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

// 3. 内部モジュール（下位層から順に）
import { Button } from '@shared/ui/button';
import { userApi } from '@entities/user';
import { LoginForm } from '@features/auth/login';
```

## インポート/エクスポートのベストプラクティス

```typescript
// ❌ 避けるべきパターン
import Button from '@shared/ui/button'; // default import
import * as userActions from '@entities/user'; // namespace import

// ✅ 推奨パターン
import { Button } from '@shared/ui/button'; // named import
import { useUser, updateUser } from '@entities/user'; // 具体的なnamed import
```

## Zustand ストア設計

```typescript
// src/entities/user/model/userStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface UserState {
  // 状態
  currentUser: User | null;

  // アクション
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        currentUser: null,
        setUser: (user) => set({ currentUser: user }),
        clearUser: () => set({ currentUser: null }),
      }),
      { name: 'user-storage' }
    )
  )
);
```

## 国際化 (i18n) 構造

```typescript
// src/shared/lib/i18n/config.ts
export const locales = ['ja', 'en'] as const;
export const defaultLocale = 'ja';

// src/features/i18n/language-switcher/ui/LanguageSwitcher.tsx
export function LanguageSwitcher() {
  // 言語切替UIの実装
}

// app/[locale]/layout.tsx
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
```

## テスト配置

```typescript
// ユニットテスト: コンポーネントと同じ場所
src/features/auth/login/ui/
├── LoginForm.tsx
└── LoginForm.test.tsx

// 統合テスト: __tests__ディレクトリ
src/features/auth/__tests__/
└── auth.integration.test.ts

// E2Eテスト: testsディレクトリ
tests/e2e/
└── login-flow.spec.ts
```

## Public API設計

```typescript
// ❌ 悪い例: 内部実装を公開
export * from './ui/LoginForm';
export * from './model/validation';
export * from './lib/helpers';

// ✅ 良い例: 必要なものだけを公開
export { LoginForm } from './ui/LoginForm';
export { useLogin } from './model/useLogin';
export type { LoginCredentials } from './model/types';
```

## 開発フロー

1. **機能追加時**: 下位層から実装

   - shared → entities → features → widgets → pages

2. **ページ追加時**:

   - `app/[locale]/(group)/route/page.tsx` にルート作成
   - `src/pages/route/` に実装追加

3. **状態管理追加時**:

   - エンティティ固有 → `entities/*/model/store.ts`
   - グローバル → `app/stores/`

4. **テスト追加時**:
   - ユニットテスト → コンポーネントと同じ場所
   - E2Eテスト → `tests/e2e/`
