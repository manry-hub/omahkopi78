import { clerkMiddleware, createRouteMatcher } from "@clerk/astro/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export const onRequest = clerkMiddleware((auth, context) => {
    const { userId } = auth();
    const { pathname } = new URL(context.request.url);

    // 1️⃣ Jika sudah login dan akses /admin/login → redirect ke /admin
    if (userId && pathname === "/admin/login") {
        return Response.redirect(new URL("/admin", context.request.url));
    }

    // 2️⃣ Jika belum login dan akses /admin selain login → redirect ke sign in
    if (!userId && isAdminRoute(context.request) && pathname !== "/admin/login") {
        return auth().redirectToSignIn();
    }
});
