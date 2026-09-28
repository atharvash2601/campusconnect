import { getAuthenticatedUser, publicUser } from "@/lib/auth";
import { failure, success } from "@/lib/api";
export async function GET() { const user = await getAuthenticatedUser(); return user ? success(publicUser(user)) : failure("Not authenticated", 401); }
