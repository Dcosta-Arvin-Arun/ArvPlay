"use client";
import { useState, useRef, useEffect } from "react";
import { FaStepBackward, FaStepForward, FaPause, FaPlay } from "react-icons/fa";

type Song = {
  id: string;
  title: string;
  file: string;
};

function isMp3(file: string) {
  return file.toLowerCase().endsWith(".mp3");
}

export default function AudioPlayerClient({ selectedSong }: { selectedSong?: Song | null }) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    fetch("/api/songs")
      .then((res) => res.json())
      .then((data) => setSongs((data.songs || []).filter((s: Song) => isMp3(s.file))));
  }, []);

  useEffect(() => {
    if (selectedSong && songs.length > 0 && isMp3(selectedSong.file)) {
      const idx = songs.findIndex((s) => s.file === selectedSong.file);
      if (idx !== -1) {
        setCurrent(idx);
        setPlaying(true);
      }
    }
  }, [selectedSong, songs]);

  useEffect(() => {
    if (playing && audioRef.current) {
      audioRef.current.play();
    } else if (!playing && audioRef.current) {
      audioRef.current.pause();
    }
  }, [playing, current]);

  const playSong = () => {
    setPlaying(true);
  };
  const pauseSong = () => {
    setPlaying(false);
  };
  const nextSong = () => {
    setCurrent((prev) => {
      const nextIdx = (prev + 1) % songs.length;
      setPlaying(true);
      return nextIdx;
    });
  };
  const prevSong = () => {
    setCurrent((prev) => {
      const prevIdx = (prev - 1 + songs.length) % songs.length;
      setPlaying(true);
      return prevIdx;
    });
  };

  if (!songs || songs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 bg-gray-900 w-full min-h-[120px]">
        <div className="text-lg text-white">No songs found.</div>
      </div>
    );
  }

  const currentSong: Song = songs[current];

  return (
    <div className="flex flex-col items-center justify-center py-8 bg-gradient-to-t from-gray-900/80 to-gray-800/90 w-full min-h-[160px] rounded-t-2xl shadow-2xl backdrop-blur-md border-t border-gray-700">
      <audio
        ref={audioRef}
        src={currentSong.file}
        onEnded={nextSong}
        preload="auto"
        style={{ display: "none" }}
      />
      <div className="text-center mb-4">
        <div className="text-xl font-bold text-green-400 drop-shadow-lg">{currentSong.title}</div>
      </div>
      <div className="flex items-center gap-16 max-w-xl w-full justify-center mx-auto mb-4">
        <button className="bg-gray-800/80 hover:bg-gray-700/90 p-5 rounded-full text-3xl flex items-center justify-center transition-all duration-150 shadow-lg border border-gray-600" onClick={prevSong}>
          <FaStepBackward />
        </button>
        <button
          className="bg-green-500/90 hover:bg-green-600/90 p-7 rounded-full text-4xl text-white shadow-xl flex items-center justify-center transition-all duration-150 border-2 border-green-300"
          onClick={playing ? pauseSong : playSong}
        >
          {playing ? <FaPause /> : <FaPlay />}
        </button>
        <button className="bg-gray-800/80 hover:bg-gray-700/90 p-5 rounded-full text-3xl flex items-center justify-center transition-all duration-150 shadow-lg border border-gray-600" onClick={nextSong}>
          <FaStepForward />
        </button>
      </div>
      <AudioProgressBar audioRef={audioRef} playing={playing} />
    </div>
  );
}

function AudioProgressBar({ audioRef, playing }: { audioRef: React.RefObject<HTMLAudioElement | null>; playing: boolean }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, [audioRef, playing]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Number(e.target.value);
    setCurrentTime(audio.currentTime);
  };

  return (
    <div className="flex items-center gap-4 w-full max-w-lg mx-auto mt-2 px-4">
      <span className="text-xs text-gray-200 min-w-[40px] font-mono">{formatTime(currentTime)}</span>
      <input
        type="range"
        min={0}
        max={duration || 0}
        value={currentTime}
        onChange={handleSeek}
        className="w-full h-2 bg-gradient-to-r from-green-400 via-gray-700 to-green-400 rounded-lg appearance-none shadow-inner focus:outline-none focus:ring-2 focus:ring-green-400"
        style={{ accentColor: '#22c55e' }}
      />
      <span className="text-xs text-gray-200 min-w-[40px] font-mono">{formatTime(duration)}</span>
    </div>
  );
}

function formatTime(time: number) {
  if (isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}
