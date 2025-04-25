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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-lg max-w-lg w-full p-6 shadow-xl">
          <div className="mb-4 flex justify-between items-start">
            <h3 className="text-xl font-semibold text-gray-900">
              {violation ? "위반 정보" : "위반 정보 없음"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">닫기</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {violation ? (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">처분일자</h4>
                <p className="mt-1 text-sm text-gray-900">{violation.date}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">위반내용</h4>
                <p className="mt-1 text-sm text-gray-900">{violation.reason}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">처분내용</h4>
                <p className="mt-1 text-sm text-gray-900">{violation.type}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">처분근거</h4>
                <p className="mt-1 text-sm text-gray-900">{violation.law}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">소재지</h4>
                <p className="mt-1 text-sm text-gray-900">
                  {violation.location}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">해당 업소의 위반 정보가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViolationModal;
