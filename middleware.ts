import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: req });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return res;
  const supabase = createServerClient(url, key, { cookies: {
    getAll: () => req.cookies.getAll(),
    setAll: (items) => {
      items.forEach(({name,value}) => req.cookies.set(name,value));
      res = NextResponse.next({ request: req });
      items.forEach(({name,value,options}) => res.cookies.set(name,value,options));
    }
  }});
  const { data: { user } } = await supabase.auth.getUser();
  if (req.nextUrl.pathname.startsWith("/seller") && !user) {
    const target = req.nextUrl.clone(); target.pathname = "/login";
    target.searchParams.set("next", req.nextUrl.pathname); return NextResponse.redirect(target);
  }
  if (user && ["/login","/register"].includes(req.nextUrl.pathname)) return NextResponse.redirect(new URL("/seller", req.url));
  return res;
}
export const config = { matcher: ["/seller/:path*", "/login", "/register"] };