export interface SiteConfig {
  demoMode: boolean;
  siteUrl: string;
  contactEndpoint: string;
  contactEmail: string;
  hasPricing: boolean;
}

export const siteConfig: SiteConfig = {
  demoMode: true,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "",
  contactEndpoint: process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? "",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  hasPricing: false,
};
