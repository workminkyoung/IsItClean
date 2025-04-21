"use client";

import dynamic from "next/dynamic";
import React, { useState } from "react";
import ViolationModal from "@/components/ViolationModal";

const ViolationCard = dynamic(() => import("../components/ViolationCard"), {
  ssr: false,
});

interface NaverSearchItem {
  title: string;
  link: string;
  category: string;
  description: string;
  telephone: string;
  address: string;
  roadAddress: string;
  mapx: string;
  mapy: string;
}

// HTML 태그를 제거하는 함수
const removeHtmlTags = (str: string) => {
  return str.replace(/<\/?[^>]+(>|$)/g, "");
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<NaverSearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    violation?: {
      date: string;
      reason: string;
      law: string;
      type: string;
      location: string;
    };
  }>({
    isOpen: false
  });

  const sampleViolation = {
    date: "2024-03-20",
    reason: "유통기한 경과제품 진열",
    law: "식품위생법 제44조",
    type: "식품위생법 위반",
    location: "서울시 강남구 테헤란로 123"
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/search?query=${encodeURIComponent(searchQuery)}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "검색 중 오류가 발생했습니다.");
      }

      const data = await response.json();
      if (data.items && Array.isArray(data.items)) {
        // 결과에서 HTML 태그 제거
        const cleanedItems = data.items.map((item: NaverSearchItem) => ({
          ...item,
          title: removeHtmlTags(item.title),
        }));
        setSearchResults(cleanedItems);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Search error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">
            식품위생법 위반 이력 조회
          </h1>

          {/* 모달 테스트 버튼 */}
          <div className="mb-8 flex gap-4 justify-center">
            <button
              onClick={() => setModalState({ isOpen: true, violation: sampleViolation })}
              className="py-2 px-4 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
            >
              위반 있음 테스트
            </button>
            <button
              onClick={() => setModalState({ isOpen: true })}
              className="py-2 px-4 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
            >
              위반 없음 테스트
            </button>
          </div>

          {/* 기존 검색 폼 */}
          <form className="flex gap-2 mb-8" onSubmit={handleSearch}>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-gray-400 rounded-full" />
              </div>
              <input
                type="text"
                placeholder="음식점 상호명을 입력하세요"
                className="w-full h-12 pl-12 pr-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-black placeholder-gray-400"
                aria-label="음식점 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button
              className="w-full h-12 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="검색하기"
              onClick={handleSearch}
              disabled={isLoading || !searchQuery.trim()}
            >
              {isLoading ? "검색 중..." : "검색하기"}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 text-red-800 rounded-lg flex items-center space-x-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-8 space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">검색 결과</h3>
              <div className="space-y-3">
                {searchResults.map((result, index) => (
                  <div
                    key={`${result.title}-${index}`}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="text-lg font-medium text-gray-900">
                          {result.title}
                        </h4>
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          정상영업
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{result.category}</p>
                      <p className="text-sm text-gray-600">
                        {result.roadAddress || result.address}
                      </p>
                      {result.telephone && (
                        <p className="text-sm text-gray-600">
                          전화: {result.telephone}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results Message */}
          {!isLoading && searchQuery && searchResults.length === 0 && !error && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 text-gray-400">
                  <svg
                    className="w-full h-full"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-gray-900 font-medium">
                    검색 결과가 없습니다
                  </p>
                  <p className="text-gray-600 text-sm">
                    다른 검색어로 다시 시도해보세요
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <ViolationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false })}
        violation={modalState.violation}
      />
    </div>
  );
}
