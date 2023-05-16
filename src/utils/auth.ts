const GOOGLE_CLIENT_ID =
  "276902600383-t8q1cak9roi8ecg164ut0vpauff65n8r.apps.googleusercontent.com";
const GOOGLE_CALLBACK_URL = "http://localhost:5173/workspace";
export function getCodeFromUrl(url: string): string | null {
  const urlObj = new URL(url);
  const params = new URLSearchParams(urlObj.search);
  const code = params.get("code");
  return code;
}
export function createGoogleLoginUrl() {
  const baseUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const scope = "email profile"; // 请求 email 和 profile 信息
  const responseType = "code"; // 我们希望得到一个授权码

  const url = new URL(baseUrl);

  url.searchParams.append("client_id", GOOGLE_CLIENT_ID);
  url.searchParams.append("redirect_uri", GOOGLE_CALLBACK_URL);
  url.searchParams.append("scope", scope);
  url.searchParams.append("response_type", responseType);

  // return url.toString();
  window.location.href = url.toString();
}
