import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { REQUEST, requestHandler } from './utils/requestHandler.utils';
import { getToken } from 'next-auth/jwt';
import { JWT_SECRET } from './constants/config.constants';
import { JWT } from 'next-auth/jwt';



interface IJWT extends JWT {
  userId: string;
}

interface HelloRequest extends NextRequest {
  [key: symbol]: any; // Define the type of symbol properties  
}

export async function middleware(request: HelloRequest) {
  // const requestPath = request.nextUrl.pathname; //url hit
  // const requestMethod = request.method as REQUEST;
  // console.log('middleware hit...', requestPath, requestMethod);

  // const symbols = Object.getOwnPropertySymbols(request);
  // symbols.forEach(item => {
  //   console.log('====================================');
  //   console.log("NEWWWWW", request[item]);
  //   console.log('====================================');
  // })


  const decoded = await getToken({ req: request, secret: JWT_SECRET }) as IJWT;

  if (decoded) {
    // console.log('HELLLLLOOO WORLDDDDD', decoded.email);
  }


  // const result = await userService.getPermissionsById(userId);
  // console.log({ result })

  // console.log("requestId", request.cookies);
  // request.cookies.set('USER_ID', "1234");

  //for category route:
  // if (requestPath.startsWith('/api/category')) {
  //   // const isAllowed = await requestHandler(requestMethod, 'category', userId);
  //   // if (!isAllowed) {
  //   //   throw Error(`You are not allowed to access this resource`);
  //   // }

  //   return NextResponse.next()
  // }



  //other protected routes:
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/videos/:path*',
    '/api/user',
    '/api/roles',
    '/api/course',
    '/api/category',
    '/api/sub-category',
    '/auth'
  ]
}


/* Proxy Logic
  If the path matches /videos/:path*, apply the proxy logic
  if (requestPath.startsWith('/videos/')) {
    // Your proxy logic here
    // Set headers and rewrite the request
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("Authorization", `Bearer ${accessToken}`);
    requestHeaders.set("Cookie", cookieValue);

    const [, , id] = request.nextUrl.pathname.split('/');
    console.log('videoId', id)
    request.nextUrl.href = `https://player.vimeo.com/video/${id}`;

    return NextResponse.rewrite(request.nextUrl, {
      request: {
        headers: requestHeaders,
      },
    });
  }


*/
