"use client";
import { useEffect, useState } from "react";
import { FaPlay, FaHeart, FaClock, FaList, FaMusic } from "react-icons/fa";

type Song = {
  id: string;
  title: string;
  file: string;
};

type RecentlyPlayed = Song & {
  lastPlayed: string;
  playCount: number;
};

export default function LibraryClient({ onPlay }: { onPlay?: (song: Song) => void }) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<RecentlyPlayed[]>([]);
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [activeTab, setActiveTab] = useState<'recent' | 'liked' | 'playlists'>('recent');

  useEffect(() => {
    // Fetch all songs
    fetch("/api/songs")
      .then((res) => res.json())
      .then((data) => setSongs(data.songs || []));

    // Mock recently played (in real app, this would come from user data)
    const mockRecentlyPlayed: RecentlyPlayed[] = [
      {
        id: "1",
        title: "Demon Slayer「AMV」- Blood __ Water",
        file: "/music/Demon Slayer「AMV」-  Blood __ Water.mp3",
        lastPlayed: "2 hours ago",
        playCount: 15
      },
      {
        id: "2", 
        title: "AURORA - Runaway",
        file: "/music/AURORA - Runaway [blank].mp3",
        lastPlayed: "5 hours ago",
        playCount: 8
      },
      {
        id: "3",
        title: "OneRepublic - Counting Stars",
        file: "/music/OneRepublic - Counting Stars.mp3",
        lastPlayed: "1 day ago",
        playCount: 12
      }
    ];
    setRecentlyPlayed(mockRecentlyPlayed);

    // Mock liked songs
    const mockLikedSongs: Song[] = [
      {
        id: "1",
        title: "AURORA - Runaway",
        file: "/music/AURORA - Runaway [blank].mp3"
      },
      {
        id: "2",
        title: "Arijit Singh - Khairiyat",
        file: "/music/Arijit Singh - Khairiyat (Bonus Track).mp3"
      }
    ];
    setLikedSongs(mockLikedSongs);
  }, []);

  const formatPlayCount = (count: number) => {
    return count === 1 ? "1 play" : `${count} plays`;
  };

  return (
    <div className="flex flex-col gap-8 p-8">
      <div>
        <h1 className="text-4xl font-bold mb-2 text-green-500">Your Library</h1>
        <p className="text-gray-400 text-lg mb-8">Your music collection and listening history</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('recent')}
          className={`flex items-center gap-2 pb-4 px-2 transition-colors ${
            activeTab === 'recent' 
              ? 'text-green-500 border-b-2 border-green-500' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <FaClock />
          Recently Played
        </button>
        <button
          onClick={() => setActiveTab('liked')}
          className={`flex items-center gap-2 pb-4 px-2 transition-colors ${
            activeTab === 'liked' 
              ? 'text-green-500 border-b-2 border-green-500' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <FaHeart />
          Liked Songs
        </button>
        <button
          onClick={() => setActiveTab('playlists')}
          className={`flex items-center gap-2 pb-4 px-2 transition-colors ${
            activeTab === 'playlists' 
              ? 'text-green-500 border-b-2 border-green-500' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <FaList />
          Playlists
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
        {activeTab === 'recent' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
              <FaClock className="text-green-500" />
              Recently Played
            </h2>
            {recentlyPlayed.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <FaMusic className="mx-auto text-4xl mb-4 opacity-50" />
                <p>No recently played songs yet</p>
                <p className="text-sm">Start listening to see your history here</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentlyPlayed.map((song) => (
                  <div key={song.id} className="flex items-center gap-4 p-3 hover:bg-gray-800 rounded-lg transition-colors">
                    <button
                      className="bg-green-500 hover:bg-green-600 p-2 rounded-full text-white flex items-center justify-center"
                      onClick={() => onPlay && onPlay(song)}
                      aria-label={`Play ${song.title}`}
                    >
                      <FaPlay />
                    </button>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium truncate">{song.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{song.lastPlayed}</span>
                        <span>•</span>
                        <span>{formatPlayCount(song.playCount)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'liked' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
              <FaHeart className="text-red-500" />
              Liked Songs
            </h2>
            {likedSongs.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <FaHeart className="mx-auto text-4xl mb-4 opacity-50" />
                <p>No liked songs yet</p>
                <p className="text-sm">Like songs to add them to your collection</p>
              </div>
            ) : (
              <div className="space-y-2">
                {likedSongs.map((song) => (
                  <div key={song.id} className="flex items-center gap-4 p-3 hover:bg-gray-800 rounded-lg transition-colors">
                    <button
                      className="bg-green-500 hover:bg-green-600 p-2 rounded-full text-white flex items-center justify-center"
                      onClick={() => onPlay && onPlay(song)}
                      aria-label={`Play ${song.title}`}
                    >
                      <FaPlay />
                    </button>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium truncate">{song.title}</h3>
                      <p className="text-sm text-gray-400">Liked song</p>
                    </div>
                    <FaHeart className="text-red-500" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'playlists' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
              <FaList className="text-blue-500" />
              Playlists
            </h2>
            <div className="text-center py-8 text-gray-400">
              <FaList className="mx-auto text-4xl mb-4 opacity-50" />
              <p>No playlists yet</p>
              <p className="text-sm">Create playlists to organize your music</p>
              <button className="mt-4 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-white transition-colors">
                Create Playlist
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}