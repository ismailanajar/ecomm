import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-key-54321';

// Web Crypto HMAC SHA-256 Verifier (Edge Runtime Compatible)
async function verifyRefreshTokenEdge(token: string): Promise<any | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;
    const encoder = new TextEncoder();
    const data = encoder.encode(`${headerB64}.${payloadB64}`);

    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(REFRESH_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    // Decode Base64URL to bytes
    let base64 = signatureB64.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const binary = atob(base64);
    const signatureBytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      signatureBytes[i] = binary.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify('HMAC', key, signatureBytes, data);
    if (!isValid) return null;

    // Decode Payload
    let payloadBase64 = payloadB64.replace(/-/g, '+').replace(/_/g, '/');
    while (payloadBase64.length % 4) {
      payloadBase64 += '=';
    }
    const decodedPayload = atob(payloadBase64);
    const parsedPayload = JSON.parse(decodedPayload);

    // Check expiry
    if (parsedPayload.exp && Date.now() >= parsedPayload.exp * 1000) {
      return null; // Expired
    }

    return parsedPayload;
  } catch (error) {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const tokenCookie = req.cookies.get('refreshToken');
  const refreshToken = tokenCookie?.value;

  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/v1/admin');
  const isCheckoutRoute = pathname.startsWith('/checkout');

  if (isAdminRoute || isCheckoutRoute) {
    if (!refreshToken) {
      return handleUnauthorized(req, pathname);
    }

    const user = await verifyRefreshTokenEdge(refreshToken);
    if (!user) {
      return handleUnauthorized(req, pathname);
    }

    // Role-based Access Control
    if (isAdminRoute && user.role !== 'ADMIN') {
      return handleForbidden(req);
    }
  }

  return NextResponse.next();
}

function handleUnauthorized(req: NextRequest, pathname: string) {
  if (pathname.startsWith('/api/')) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'You must be logged in.' } },
      { status: 401 }
    );
  }
  const loginUrl = new URL('/login', req.url);
  loginUrl.searchParams.set('callbackUrl', pathname);
  return NextResponse.redirect(loginUrl);
}

function handleForbidden(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json(
      { error: { code: 'FORBIDDEN', message: 'Access denied.' } },
      { status: 403 }
    );
  }
  return NextResponse.redirect(new URL('/', req.url));
}

// Matching paths
export const config = {
  matcher: ['/admin/:path*', '/checkout/:path*', '/api/v1/admin/:path*'],
};
