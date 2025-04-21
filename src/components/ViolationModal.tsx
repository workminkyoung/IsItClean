"use client";

import React from "react";

interface ViolationModalProps {
  isOpen: boolean;
  onClose: () => void;
  violation?: {
    date: string;
    reason: string;
    law: string;
    type: string;
    location: string;
  };
}

const ViolationModal: React.FC<ViolationModalProps> = ({
  isOpen,
  onClose,
  violation,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-all duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg w-full max-w-xl mx-4 transform transition-all duration-300 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          {violation ? (
            <>
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-3 relative">
                  <div className="w-10 h-10 border-2 border-red-500 rounded-full absolute"></div>
                  <svg
                    className="w-8 h-8 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-red-500 mb-1">
                  위반 사항 발견
                </h2>
              </div>

              <div className="space-y-2">
                <div className="flex items-center py-2 border-b border-gray-100">
                  <p className="text-gray-600 w-24 flex-shrink-0">위반일자</p>
                  <p className="text-gray-900 flex-1">{violation.date}</p>
                </div>
                <div className="flex items-center py-2 border-b border-gray-100">
                  <p className="text-gray-600 w-24 flex-shrink-0">위반사항</p>
                  <p className="text-gray-900 flex-1">{violation.reason}</p>
                </div>
                <div className="flex items-center py-2 border-b border-gray-100">
                  <p className="text-gray-600 w-24 flex-shrink-0">법적근거</p>
                  <p className="text-gray-900 flex-1">{violation.law}</p>
                </div>
                <div className="flex items-center py-2 border-b border-gray-100">
                  <p className="text-gray-600 w-24 flex-shrink-0">위반사유</p>
                  <p className="text-gray-900 flex-1">{violation.type}</p>
                </div>
                <div className="flex items-center py-2 border-b border-gray-100">
                  <p className="text-gray-600 w-24 flex-shrink-0">위반장소</p>
                  <p className="text-gray-900 flex-1">{violation.location}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3 relative">
                <div className="w-10 h-10 border-2 border-green-500 rounded-full absolute"></div>
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-green-500 mb-4">
                위반 사항 없음
              </h2>
              <p className="text-gray-600 text-center mb-4">
                해당 업소는 현재 식품위생법 관련<br />
                위반 사항이 없습니다.
              </p>
            </div>
          )}

          <button
            onClick={onClose}
            className={`w-full mt-8 py-3 rounded-lg transition-colors ${
              violation
                ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                : "bg-green-100 text-green-800 hover:bg-green-200"
            }`}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViolationModal;
