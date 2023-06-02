import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(request: NextRequest, response: NextResponse) {
	// const cookies = request.cookies;
	// await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/refresh`, {
	//   method: "POST",
	// })
	return NextResponse.next();
}
