import { prisma } from './prisma';

export interface SiteSettings {
  logoText: string;
  logoUrl: string;
  faviconUrl: string;
  siteTitle: string;
  seoDescription: string;
  footerText: string;
  footerMailAddress: string;
  footerOfficeAddress: string;
  socialFacebook: string;
  socialTwitter: string;
  socialYoutube: string;
  socialInstagram: string;
  currencyCode: string;
  logoDisplayType: string;
  heroBanners: string;
}

export async function getSettings(): Promise<SiteSettings> {
  try {
    const settingsList = await prisma.setting.findMany();
    const settings: Record<string, string> = {};
    settingsList.forEach((s) => {
      settings[s.key] = s.value;
    });

    return {
      logoText: settings.logoText || 'TanimStore',
      logoUrl: settings.logoUrl || '',
      faviconUrl: settings.faviconUrl || '/favicon.ico',
      siteTitle: settings.siteTitle || 'TanimStore - Premium E-Commerce Storefront',
      seoDescription: settings.seoDescription || 'A secure, modern, and beautiful online shopping experience.',
      footerText: settings.footerText || `© ${new Date().getFullYear()} TanimStore.com Inc. All rights reserved.`,
      footerMailAddress: settings.footerMailAddress || '',
      footerOfficeAddress: settings.footerOfficeAddress || '',
      socialFacebook: settings.socialFacebook || '',
      socialTwitter: settings.socialTwitter || '',
      socialYoutube: settings.socialYoutube || '',
      socialInstagram: settings.socialInstagram || '',
      currencyCode: settings.currencyCode || 'USD',
      logoDisplayType: settings.logoDisplayType || 'both',
      heroBanners: settings.heroBanners || defaultBanners,
    };
  } catch (err) {
    console.error('Error fetching settings from database:', err);
    return {
      logoText: 'TanimStore',
      logoUrl: '',
      faviconUrl: '/favicon.ico',
      siteTitle: 'TanimStore - Premium E-Commerce Storefront',
      seoDescription: 'A secure, modern, and beautiful online shopping experience.',
      footerText: `© ${new Date().getFullYear()} TanimStore.com Inc. All rights reserved.`,
      footerMailAddress: '',
      footerOfficeAddress: '',
      socialFacebook: '',
      socialTwitter: '',
      socialYoutube: '',
      socialInstagram: '',
      currencyCode: 'USD',
      logoDisplayType: 'both',
      heroBanners: defaultBanners,
    };
  }
}

export const defaultBanners = JSON.stringify([
  {
    id: '1',
    imageUrl: '',
    title: 'Elevate Your Space with Curated Essentials',
    subtitle: 'Explore handpicked electronics, premium apparel, and modern home utilities.',
    buttonText: 'Shop Catalog',
    buttonLink: '/#catalog'
  },
  {
    id: '2',
    imageUrl: '',
    title: 'Big Deals on Electronics',
    subtitle: 'Discover verified deals on smartphones, apparel, and coffee appliances.',
    buttonText: 'Explore Tech',
    buttonLink: '/?category=electronics'
  }
]);
