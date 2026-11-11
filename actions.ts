"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
const get = (fd:FormData,k:string)=>String(fd.get(k)??"").trim();
export async function signUp(fd:FormData){
 const fullName=get(fd,"fullName"), shopName=get(fd,"shopName"), email=get(fd,"email").toLowerCase(), country=get(fd,"country"), password=String(fd.get("password")??"");
 if(!fullName||!shopName||!email||!country||password.length<10) redirect("/register?error=Please%20complete%20all%20fields%20and%20use%20a%2010-character%20password");
 const supabase=await createClient();
 const {data,error}=await supabase.auth.signUp({email,password,options:{emailRedirectTo:`${process.env.NEXT_PUBLIC_SITE_URL??"http://localhost:3000"}/auth/callback`,data:{full_name:fullName,shop_name:shopName,country}}});
 if(error) redirect(`/register?error=${encodeURIComponent(error.message)}`);
 if(data.session) redirect("/seller");
 redirect("/register?message=Check%20your%20email%20to%20confirm%20your%20account%2C%20then%20sign%20in.");
}
export async function signIn(fd:FormData){
 const email=get(fd,"email").toLowerCase(), password=String(fd.get("password")??"");
 const supabase=await createClient(); const {error}=await supabase.auth.signInWithPassword({email,password});
 if(error) redirect("/login?error=Email%20or%20password%20is%20incorrect");
 redirect("/seller");
}
export async function signOut(){const supabase=await createClient();await supabase.auth.signOut();redirect("/");}