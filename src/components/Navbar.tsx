export default function Navbar() {
  return (
    <header className="bg-gray-800 text-white w-full h-16 flex items-center px-8 shadow">
  <h1 className="text-xl font-semibold">ArvPlay</h1>
      <div className="ml-auto flex items-center gap-4">
        {/* Add user info, notifications, etc. here */}
        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">User</span>
      </div>
    </header>
  );
}
