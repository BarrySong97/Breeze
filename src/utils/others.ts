export function isMobile() {
  const userAgent = navigator.userAgent.toLowerCase();
  const keywords = ["mobile", "android", "iphone", "ipad"];
  return keywords.some((keyword) => userAgent.indexOf(keyword) > -1);
}
