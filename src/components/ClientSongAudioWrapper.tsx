"use client";
import { useState } from "react";
import SongListClient from "./SongListClient";
import AudioPlayerClient from "./AudioPlayerClient";

type Song = {
  id: string;
  title: string;
  file: string;
};

export default function ClientSongAudioWrapper() {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  return (
    <>
      <SongListClient onPlay={setSelectedSong} />
      <div className="fixed bottom-0 left-0 w-full z-10">
        <AudioPlayerClient selectedSong={selectedSong} />
      </div>
    </>
  );
}
