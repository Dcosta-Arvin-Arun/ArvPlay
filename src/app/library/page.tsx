export default function Library() {
  return (
    <div className="flex flex-col gap-8 p-8">
      <h1 className="text-4xl font-bold mb-2 text-green-500">Your Library</h1>
      <p className="text-gray-400 text-lg mb-8">Your saved songs and playlists will appear here.</p>
      {/* Add user's playlists and liked songs here */}
    </div>
  );
}