import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "검색어가 필요합니다." },
      { status: 400 }
    );
  }

  try {
    const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET;

    console.log("Naver Search Query:", query);

    const response = await fetch(
      `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(
        query
      )}&display=5`,
      {
        headers: {
          "X-Naver-Client-Id": clientId || "",
          "X-Naver-Client-Secret": clientSecret || "",
        },
      }
    );

    const data = await response.json();
    console.log("Naver Search API Response:", JSON.stringify(data, null, 2));

    if (response.ok) {
      return NextResponse.json(data);
    } else {
      console.error("Naver API Error:", data);
      return NextResponse.json(
        { error: "검색 중 오류가 발생했습니다." },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "검색 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
