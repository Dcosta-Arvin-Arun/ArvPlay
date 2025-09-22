import Link from "next/link";
import { FaHome, FaSearch, FaBook, FaListUl, FaPlay } from "react-icons/fa";

const navItems = [
  { name: "Home", href: "/", icon: <FaHome /> },
  { name: "Search", href: "/search", icon: <FaSearch /> },
  { name: "Library", href: "/library", icon: <FaBook /> },
  { name: "Playlist", href: "/playlist", icon: <FaListUl /> },
];

export default function Sidebar() {
  return (
    <aside className="bg-black text-gray-200 w-64 fixed top-0 left-0 h-screen p-6 flex flex-col gap-8 border-r border-gray-800 overflow-y-auto z-20">
      <div className="flex items-center gap-2 mb-8">
        <span className="bg-green-500 rounded-full w-6 h-6 flex items-center justify-center text-black font-bold text-lg">
          S
        </span>
        <h2 className="text-2xl font-bold tracking-tight">Spotify</h2>
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800 transition-colors text-base"
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto pt-8 border-t border-gray-800">
        <div className="text-xs text-gray-400">© 2025 Spotify Clone</div>
      </div>
    </aside>
  );
}
