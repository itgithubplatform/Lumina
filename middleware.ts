export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    "/classroom/:path*",
    "/file/:path*",
    "/lesson/:path*",
  ],
}