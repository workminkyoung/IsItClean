"use client";

import React, { useState } from "react";
import ViolationModal from "./ViolationModal";

interface ViolationCardProps {
  violation: {
    date: string;
    reason: string;
    law: string;
    type: string;
    location: string;
  };
}

const ViolationCard: React.FC<ViolationCardProps> = ({ violation }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
      >
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg
              className="w-6 h-6 text-red-500"
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
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-500 mb-1">
              위반 사항 발견
            </h3>
            <p className="text-gray-600 text-sm mb-2">{violation.date}</p>
            <p className="text-gray-800">{violation.reason}</p>
            <p className="text-gray-600 text-sm mt-2">{violation.location}</p>
          </div>
        </div>
      </div>

      <ViolationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        violation={violation}
      />
    </>
  );
};

export default ViolationCard;
