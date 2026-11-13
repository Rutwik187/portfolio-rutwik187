/** True when a browser request comes from one of this site's own pages. */
export function isSameOrigin(request: Request) {
  try {
    const origin = request.headers.get("origin")
    return origin !== null && new URL(origin).host === new URL(request.url).host
  } catch {
    return false
  }
}
