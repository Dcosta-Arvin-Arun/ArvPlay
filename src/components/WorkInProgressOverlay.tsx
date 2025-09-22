"use client";
import { useState } from "react";

export default function WorkInProgressOverlay() {
  const [showOverlay, setShowOverlay] = useState(true);

  if (!showOverlay) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-green-600">🚧 Work In Progress</h2>
        <p className="mb-6 text-gray-700">
          ArvPlay is currently under development.<br />
          Features and design may change!
        </p>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          onClick={() => setShowOverlay(false)}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
