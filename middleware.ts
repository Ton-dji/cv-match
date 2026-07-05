import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ req, token }) {
      if (req.nextUrl.pathname.startsWith("/admin")) {
        return token?.role === "ADMIN";
      }
      return !!token;
    },
  },
});

export const config = {
  // Protect all routes except for authentication routes, public static files, and login/register pages
  matcher: ["/((?!api/auth|login|register|_next/static|_next/image|favicon.ico).*)"],
};
