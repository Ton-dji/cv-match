import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  // Protect all routes except for authentication routes, public static files, and login/register pages
  matcher: ["/((?!api/auth|login|register|_next/static|_next/image|favicon.ico).*)"],
};
