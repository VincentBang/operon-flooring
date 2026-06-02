export const siteConfig = {
  name: "Operon Flooring",
  origin: "https://operonflooring.com.au",
  phone: "04XX XXX XXX",
  email: "quotes@operonflooring.com.au",
  serviceArea: "Sydney and surrounding suburbs"
};

export function absoluteUrl(path: string) {
  return new URL(path, siteConfig.origin).toString();
}
