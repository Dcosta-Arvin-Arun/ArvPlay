type Song = {
  id: string;
  title: string;
  artist: string;
  album: string;
};

interface SongListProps {
  songs: Song[];
}

export default function SongList({ songs }: SongListProps) {
  return (
    <ul className="divide-y divide-gray-700">
      {songs.map((song) => (
        <li key={song.id} className="py-3 px-2 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-800 transition-colors">
          <div>
            <span className="font-semibold text-white">{song.title}</span>
            <span className="text-gray-400 ml-2">{song.artist}</span>
            <span className="text-gray-500 ml-2">({song.album})</span>
          </div>
          <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mt-2 sm:mt-0">Play</button>
        </li>
      ))}
    </ul>
  );
}
