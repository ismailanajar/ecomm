import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const keys = [
      'siteTitle',
      'seoDescription',
      'logoText',
      'logoUrl',
      'faviconUrl',
      'footerText',
      'footerMailAddress',
      'footerOfficeAddress',
      'socialFacebook',
      'socialTwitter',
      'socialYoutube',
      'socialInstagram',
      'currencyCode',
      'logoDisplayType',
      'heroBanners',
    ];

    for (const key of keys) {
      if (body[key] !== undefined) {
        await prisma.setting.upsert({
          where: { key },
          update: { value: String(body[key]) },
          create: { key, value: String(body[key]) },
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Settings updated successfully.' });
  } catch (error) {
    console.error('Update settings API error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update settings.',
        },
      },
      { status: 500 }
    );
  }
}
