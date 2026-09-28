import { success } from "@/lib/api";
export async function POST() { const response = success(null, "Logged out"); response.cookies.set("auth_token", "", { httpOnly: true, path: "/", maxAge: 0 }); return response; }
