"use client";

import React from "react";

interface ViolationModalProps {
  isOpen: boolean;
  onClose: () => void;
  violation: {
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
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
        <div className="p-6">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
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

          <div className="space-y-4">
            <div className="flex items-center py-3 border-b border-gray-100">
              <p className="text-gray-600 w-24 flex-shrink-0">위반일자</p>
              <p className="text-gray-900 flex-1">{violation.date}</p>
            </div>
            <div className="flex items-center py-3 border-b border-gray-100">
              <p className="text-gray-600 w-24 flex-shrink-0">위반사항</p>
              <p className="text-gray-900 flex-1">{violation.reason}</p>
            </div>
            <div className="flex items-center py-3 border-b border-gray-100">
              <p className="text-gray-600 w-24 flex-shrink-0">법적근거</p>
              <p className="text-gray-900 flex-1">{violation.law}</p>
            </div>
            <div className="flex items-center py-3 border-b border-gray-100">
              <p className="text-gray-600 w-24 flex-shrink-0">위반사유</p>
              <p className="text-gray-900 flex-1">{violation.type}</p>
            </div>
            <div className="flex items-center py-3 border-b border-gray-100">
              <p className="text-gray-600 w-24 flex-shrink-0">위반장소</p>
              <p className="text-gray-900 flex-1">{violation.location}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-8 bg-gray-100 text-gray-800 py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViolationModal;
