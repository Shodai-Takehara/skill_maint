import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// 管理者権限が必要なパス
const ADMIN_PATHS = ['/admin', '/api/admin'];
const SUPER_ADMIN_PATHS = ['/super-admin', '/api/super-admin'];

// 権限チェック（実際のアプリではJWTトークンなどから取得）
const checkUserRole = (request: NextRequest) => {
  // ここでは例としてcookieから取得
  const userRole = request.cookies.get('userRole')?.value;
  return userRole;
};

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // スーパー管理者パスへのアクセスチェック
  const isSuperAdminPath = SUPER_ADMIN_PATHS.some((superAdminPath) =>
    path.startsWith(superAdminPath)
  );

  if (isSuperAdminPath) {
    const userRole = checkUserRole(request);

    // スーパー管理者権限チェック
    if (userRole !== 'super_admin') {
      // 権限がない場合はホームへリダイレクト
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 管理者パスへのアクセスチェック
  const isAdminPath = ADMIN_PATHS.some((adminPath) =>
    path.startsWith(adminPath)
  );

  if (isAdminPath) {
    const userRole = checkUserRole(request);

    // 権限チェック
    if (!userRole || !['tenant_admin', 'line_manager'].includes(userRole)) {
      // 権限がない場合は403ページまたはホームへリダイレクト
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // 管理者パスのみマッチ
    '/admin/:path*',
    '/api/admin/:path*',
    '/super-admin/:path*',
    '/api/super-admin/:path*',
  ],
};
