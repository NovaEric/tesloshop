import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";


export async function middleware(req:NextRequest | any, event: NextFetchEvent) {

    const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    const url = req.nextUrl.clone();
    
    if (!session){
        url.pathname = 'auth/login';
        const requestPage = req.page.name;
        url.search = `p=${requestPage}`;
        const {href} = url;
        return NextResponse.rewrite(href);
    };

    const validRoles = ['admin', 'super-user', 'CEO'];

    if (!validRoles.includes(session.user.role)) { 
        url.pathname = '/';
        return NextResponse.rewrite(url); 
    };

    return NextResponse.next();

};