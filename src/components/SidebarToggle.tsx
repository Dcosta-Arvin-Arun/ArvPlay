"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { FaBars, FaTimes } from "react-icons/fa";

export default function SidebarToggle({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      {/* Toggle button with icon */}
      <button
        className="fixed top-4 left-4 z-30 bg-green-500 text-white p-3 rounded-full shadow-lg lg:hidden flex items-center justify-center text-2xl"
        onClick={() => setSidebarOpen((open) => !open)}
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>
      {sidebarOpen && <Sidebar />}
      <div className={sidebarOpen ? "ml-64 transition-all" : "ml-0 transition-all"}>
        {children}
      </div>
    </>
  );
}
