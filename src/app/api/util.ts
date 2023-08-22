export function getApiUrl(url: string) {
  const vercelUrl = process.env.VERCEL_URL;
  const apiUrl = vercelUrl ? `https://${vercelUrl}` : process.env.URL;
  return `${apiUrl}${url}`;
}
