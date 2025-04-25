import { NextResponse } from "next/server";

// 인허가 업소 정보 조회
async function fetchLicenseInfo(businessName: string, apiKey: string) {
  const serviceId = "I2500"; // 인허가 업소 정보 서비스 ID
  const dataType = "json";
  const baseUrl = `http://openapi.foodsafetykorea.go.kr/api/${apiKey}/${serviceId}/${dataType}/1/10`;

  // URL에 직접 파라미터 추가
  const fullUrl = `${baseUrl}/BSSH_NM=${encodeURIComponent(businessName)}`;

  console.log("=== 인허가 정보 API 요청 ===");
  console.log("Business Name:", businessName);
  console.log("Service ID:", serviceId);
  console.log("Base URL:", baseUrl);
  console.log("Full URL:", fullUrl);
  console.log("========================");

  try {
    const response = await fetch(fullUrl);
    const data = await response.json();

    console.log("=== 인허가 정보 API 응답 ===");
    console.log("Response Status:", response.status);
    console.log("Response Data:", JSON.stringify(data, null, 2));
    console.log("Result Code:", data.I2500?.RESULT?.CODE);
    console.log("Result Message:", data.I2500?.RESULT?.MSG);
    if (data.I2500?.row) {
      console.log("Found Entries:", data.I2500.row.length);
    }
    console.log("========================");

    if (data.I2500?.RESULT?.CODE === "INFO-000") {
      if (data.I2500.row && data.I2500.row.length > 0) {
        return data.I2500.row[0];
      }
      console.log("No license info found in response");
      return null;
    } else {
      console.log(
        "License Info API Error:",
        data.I2500?.RESULT?.MSG || "Unknown error"
      );
      return null;
    }
  } catch (error) {
    console.error("License Info API Error:", error);
    throw new Error("인허가 정보 조회 중 오류가 발생했습니다.");
  }
}

// 행정처분 정보 조회
async function fetchViolationInfo(licenseNumber: string, apiKey: string) {
  const serviceId = "I2630"; // 행정처분 서비스 ID
  const dataType = "json";
  const baseUrl = `http://openapi.foodsafetykorea.go.kr/api/${apiKey}/${serviceId}/${dataType}/1/5`;

  const params = {
    LCNS_NO: licenseNumber, // 인허가번호로 조회
  };

  const queryString = new URLSearchParams(params).toString();
  const fullUrl = `${baseUrl}/${queryString}`;

  console.log("Violation Info Request URL:", fullUrl);
  console.log("Violation Info Request Parameters:", params);

  try {
    const response = await fetch(fullUrl);
    const data = await response.json();
    console.log("Violation Info Raw Response:", JSON.stringify(data, null, 2));

    if (data.I2630?.RESULT?.CODE === "INFO-000") {
      return data.I2630.row || [];
    } else {
      console.log(
        "Violation Info API Error:",
        data.I2630?.RESULT?.MSG || "Unknown error"
      );
      return [];
    }
  } catch (error) {
    console.error("Violation Info API Error:", error);
    throw new Error("행정처분 정보 조회 중 오류가 발생했습니다.");
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const businessName = searchParams.get("businessName");
  const address = searchParams.get("address");

  console.log("Search Parameters:", {
    businessName,
    address,
  });

  if (!businessName) {
    return NextResponse.json(
      { error: "업체명이 필요합니다." },
      { status: 400 }
    );
  }

  try {
    const apiKey = process.env.FOOD_SAFETY_API_KEY;
    if (!apiKey) {
      console.error("API key is not set");
      throw new Error("API 키가 설정되지 않았습니다.");
    }

    // 1. 먼저 인허가 정보 조회
    const licenseInfo = await fetchLicenseInfo(businessName, apiKey);
    if (!licenseInfo) {
      console.log("No license info found for:", businessName);
      return NextResponse.json([]);
    }

    console.log("Found license info:", {
      licenseNumber: licenseInfo.LCNS_NO,
      businessName: licenseInfo.BSSH_NM,
      address: licenseInfo.ADDR,
    });

    // 주소 정보로 필터링
    if (address) {
      const searchAddressParts = address.split(" ");
      const licenseAddressParts = licenseInfo.ADDR.split(" ");

      // 시/도와 시/군/구가 일치하는지 확인
      if (searchAddressParts.length >= 2 && licenseAddressParts.length >= 2) {
        if (
          searchAddressParts[0] !== licenseAddressParts[0] ||
          searchAddressParts[1] !== licenseAddressParts[1]
        ) {
          console.log("Address mismatch:", {
            search: `${searchAddressParts[0]} ${searchAddressParts[1]}`,
            license: `${licenseAddressParts[0]} ${licenseAddressParts[1]}`,
          });
          return NextResponse.json([]);
        }
      }
    }

    // 2. 인허가번호로 행정처분 정보 조회
    const violations = await fetchViolationInfo(licenseInfo.LCNS_NO, apiKey);
    return NextResponse.json(violations);
  } catch (error) {
    console.error("API request error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "정보 조회 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
