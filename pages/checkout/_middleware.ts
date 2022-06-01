import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
// import { JWT } from "../../utils";



export async function middleware(req:NextRequest, event: NextFetchEvent) {

    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!session){
        const url = req.nextUrl.clone();
        url.pathname = 'auth/login';
        const requestPage = req.page.name;
        url.search = `p=${requestPage}`;
        const {href} = url;
        return NextResponse.rewrite(href);
    };

    return NextResponse.next();
  
    // const {token = ''} = req.cookies;

    // try {
        // await JWT.isValidToken(token);
        // return NextResponse.next();
    // } catch (error) {
        // const requestPage = req.page.name;
        // return NextResponse.redirect(`/auth/login?p=${requestPage}`);
        // console.log(req.page)
    // }
};