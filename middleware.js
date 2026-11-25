import { NextResponse } from "next/server";
import { isModuleAgnosticRoute } from "./src/utils/moduleRoutes";

// Define the protected routes
const protectedRoutes = ["/rental/cart"];
const PREVIEW_TOKEN_COOKIE = "aduanefie_preview_token";

function hasUnexpiredPreviewToken(rawToken) {
  if (!rawToken || typeof rawToken !== "string") return false;
  const dotIdx = rawToken.indexOf(".");
  if (dotIdx <= 0) return false;
  const expStr = rawToken.slice(0, dotIdx);
  const sigStr = rawToken.slice(dotIdx + 1);
  if (!/^\d+$/.test(expStr) || !/^[a-f0-9]{64}$/i.test(sigStr)) return false;
  const expSec = Number(expStr);
  return Number.isFinite(expSec) && expSec > Math.floor(Date.now() / 1000);
}

export function middleware(request) {
  const { pathname, searchParams } = request.nextUrl;
  const host = (request.headers.get("host") || "").split(":")[0].toLowerCase();

  // Consolidate legacy web.aduanefie.com and www.aduanefie.com onto aduanefie.com
  if (host === "web.aduanefie.com" || host === "www.aduanefie.com") {
    const canonicalUrl = new URL(
      `${pathname}${request.nextUrl.search}`,
      "https://aduanefie.com"
    );
    return NextResponse.redirect(canonicalUrl, 308);
  }

  // Enforce Edge-level private preview gate across all website routes unless
  // public access has been explicitly opened via NEXT_PUBLIC_PUBLIC_ACCESS_OPEN=true.
  const publicAccessOpen =
    process.env.NEXT_PUBLIC_PUBLIC_ACCESS_OPEN === "true";
  if (!publicAccessOpen && !pathname.startsWith("/api/")) {
    const previewToken = request.cookies.get(PREVIEW_TOKEN_COOKIE)?.value;
    const isUnlocked = hasUnexpiredPreviewToken(previewToken);

    if (!isUnlocked && pathname !== "/coming-soon") {
      const gateUrl = request.nextUrl.clone();
      const intended = `${pathname}${request.nextUrl.search || ""}`;
      gateUrl.pathname = "/coming-soon";
      gateUrl.search =
        intended && intended !== "/"
          ? `?next=${encodeURIComponent(intended)}`
          : "";
      return NextResponse.redirect(gateUrl, 307);
    }

    if (isUnlocked && pathname === "/coming-soon") {
      const nextParam = searchParams.get("next") || "/";
      const safeTarget =
        nextParam.startsWith("/") && !nextParam.startsWith("//")
          ? nextParam
          : "/";
      return NextResponse.redirect(new URL(safeTarget, request.url), 307);
    }
  }

  // Get module & location flags from cookies (set on client)
  const moduleFromCookie = request.cookies.get("selectedModule")?.value;
  const hasLocation = request.cookies.get("aduanefie_location_set")?.value === "1";

  // First-time visitors (no location selected yet) land on /welcome to pick
  // their location & module and explore platform programs. Returning visitors
  // who already selected a location go straight into the live marketplace (/home).
  if (pathname === "/") {
    // Serve root page directly without redirect
    return NextResponse.next();
  }

  // Check if request already has module/module_id param
  const hasModuleParam =
    searchParams.has("module") || searchParams.has("module_id");

  // Check if this route should skip module parameter
  const shouldSkipModule = isModuleAgnosticRoute(pathname);

  // If no module param in URL but we have one saved, and route is not excluded, add it
  if (!hasModuleParam && moduleFromCookie && !shouldSkipModule) {
    searchParams.set("module", moduleFromCookie);
    const response = NextResponse.redirect(request.nextUrl);
    return response;
  }

  // Remove legacy module_id if module exists (keep only module)
  if (searchParams.has("module") && searchParams.has("module_id")) {
    searchParams.delete("module_id");
    const response = NextResponse.redirect(request.nextUrl);
    return response;
  }

  // Convert old module_id to module
  if (searchParams.has("module_id") && !searchParams.has("module")) {
    const moduleId = searchParams.get("module_id");
    searchParams.delete("module_id");
    searchParams.set("module", moduleId);
    const response = NextResponse.redirect(request.nextUrl);
    return response;
  }

  if (protectedRoutes.includes(pathname)) {
    const cartListCookie = request.cookies.get("cart-list");
    const cartListValue = cartListCookie?.value;

    // Only redirect when the cookie explicitly says the cart is empty. On
    // the very first visit the cookie isn't set yet (the client writes it
    // after the cart fetch resolves) - bouncing to /home in that case was
    // the cause of the "redirected the first time, ok the second time" bug.
    if (cartListValue === "0") {
      const url = new URL("/home", request.url);
      return NextResponse.redirect(url);
    }
  }

  const response = NextResponse.next();
  response.headers.set("x-middleware-check", "working");
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.sw\\.js|firebase-messaging-sw\\.js|workbox-.*\\.js|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|otf|eot|mp4|webm|mp3|wav|pdf|zip)).*)",
  ],
};
