export default function Search() {
  return (
    <div className="flex flex-col gap-8 p-8">
      <h1 className="text-4xl font-bold mb-2 text-green-500">Search</h1>
      <p className="text-gray-400 text-lg mb-8">Find your favorite songs, artists, and playlists.</p>
      <input
        type="text"
        placeholder="What do you want to listen to?"
        className="w-full max-w-xl p-4 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      {/* Add search results here */}
    </div>
  );
}