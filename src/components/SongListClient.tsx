"use client";
import { useEffect, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";

type Song = {
  id: string;
  title: string;
  file: string;
};

export default function SongListClient({ onPlay }: { onPlay?: (song: Song) => void }) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    fetch("/api/songs")
      .then((res) => res.json())
      .then((data) => setSongs(data.songs || []));
  }, []);

  // Listen to global player state updates from AudioPlayerClient
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { songId?: string | null; playing?: boolean };
      if (!detail) return;
      setCurrentSongId(detail.songId ?? null);
      setIsPlaying(!!detail.playing);
    };
    window.addEventListener("arvplay:player-state", handler as EventListener);
    return () => window.removeEventListener("arvplay:player-state", handler as EventListener);
  }, []);

  return (
    <div className="bg-gray-900 rounded-lg p-6 shadow-lg max-h-[400px] overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-4 text-white">All Songs</h2>
      <ul className="divide-y divide-gray-800">
        {songs.map((song) => (
          <li key={song.id} className="py-3 px-2 flex justify-between items-center hover:bg-gray-800 transition-colors">
            <span className="text-white truncate">{song.title}</span>
            <button
              className="bg-green-500 hover:bg-green-600 p-2 rounded-full text-white flex items-center justify-center ml-2"
              onClick={() => {
                if (currentSongId === song.id) {
                  // Toggle play/pause for current song via global command
                  window.dispatchEvent(
                    new CustomEvent("arvplay:command", {
                      detail: { command: isPlaying ? "pause" : "play", songId: song.id },
                    })
                  );
                } else {
                  // Start playing a different song
                  onPlay && onPlay(song);
                }
              }}
              aria-label={`Play ${song.title}`}
            >
              {currentSongId === song.id && isPlaying ? <FaPause /> : <FaPlay />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
