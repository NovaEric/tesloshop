import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";


export async function middleware(req:NextRequest | any, event: NextFetchEvent) {

    const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    const validRoles = ['admin', 'super-user', 'SEO'];

    if (!session || !validRoles.includes(session.user.role)){
        return new Response( JSON.stringify({message: 'Unauthorized'}), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    };

    return NextResponse.next();

};