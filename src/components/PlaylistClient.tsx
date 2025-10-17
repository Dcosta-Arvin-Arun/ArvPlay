"use client";
import { useEffect, useState, useRef } from "react";
import { FaPlay, FaPlus, FaEdit, FaTrash, FaMusic, FaSave, FaTimes, FaHeart, FaClock, FaEllipsisV } from "react-icons/fa";

type Song = {
  id: string;
  title: string;
  file: string;
};

type Playlist = {
  id: string;
  name: string;
  description: string;
  songs: Song[];
  createdAt: string;
  coverColor: string;
};

export default function PlaylistClient({ onPlay }: { onPlay?: (song: Song) => void }) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddSongModal, setShowAddSongModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("");
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  // Play All state
  const [playAllIndex, setPlayAllIndex] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Color options for playlist covers
  const coverColors = [
    "bg-gradient-to-br from-purple-500 to-pink-600",
    "bg-gradient-to-br from-blue-500 to-cyan-600", 
    "bg-gradient-to-br from-green-500 to-teal-600",
    "bg-gradient-to-br from-orange-500 to-red-600",
    "bg-gradient-to-br from-indigo-500 to-purple-600",
    "bg-gradient-to-br from-pink-500 to-rose-600"
  ];

  useEffect(() => {
    // Fetch all available songs
    fetch("/api/songs")
      .then((res) => res.json())
      .then((data) => setAllSongs(data.songs || []));

    // Load playlists from localStorage (in real app, this would be from a database)
    const savedPlaylists = localStorage.getItem("arvplay-playlists");
    if (savedPlaylists) {
      setPlaylists(JSON.parse(savedPlaylists));
    } else {
      // Create a sample playlist
      const samplePlaylist: Playlist = {
        id: "sample-1",
        name: "My Favorites",
        description: "A collection of my favorite tracks",
        songs: [],
        createdAt: new Date().toISOString(),
        coverColor: coverColors[0]
      };
      setPlaylists([samplePlaylist]);
      localStorage.setItem("arvplay-playlists", JSON.stringify([samplePlaylist]));
    }
  }, []);

  const savePlaylistsToStorage = (updatedPlaylists: Playlist[]) => {
    setPlaylists(updatedPlaylists);
    localStorage.setItem("arvplay-playlists", JSON.stringify(updatedPlaylists));
  };

  const createPlaylist = () => {
    if (!newPlaylistName.trim()) return;

    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      name: newPlaylistName,
      description: newPlaylistDescription,
      songs: [],
      createdAt: new Date().toISOString(),
      coverColor: coverColors[Math.floor(Math.random() * coverColors.length)]
    };

    const updatedPlaylists = [...playlists, newPlaylist];
    savePlaylistsToStorage(updatedPlaylists);
    
    setNewPlaylistName("");
    setNewPlaylistDescription("");
    setShowCreateModal(false);
  };

  const deletePlaylist = (playlistId: string) => {
    const updatedPlaylists = playlists.filter(p => p.id !== playlistId);
    savePlaylistsToStorage(updatedPlaylists);
    if (selectedPlaylist?.id === playlistId) {
      setSelectedPlaylist(null);
    }
  };

  const updatePlaylist = (updatedPlaylist: Playlist) => {
    const updatedPlaylists = playlists.map(p => 
      p.id === updatedPlaylist.id ? updatedPlaylist : p
    );
    savePlaylistsToStorage(updatedPlaylists);
    setSelectedPlaylist(updatedPlaylist);
    setEditingPlaylist(null);
  };

  const addSongToPlaylist = (song: Song) => {
    if (!selectedPlaylist) return;
    
    // Check if song is already in playlist
    const songExists = selectedPlaylist.songs.some(s => s.id === song.id);
    if (songExists) return;

    const updatedPlaylist = {
      ...selectedPlaylist,
      songs: [...selectedPlaylist.songs, song]
    };
    
    updatePlaylist(updatedPlaylist);
  };

  const removeSongFromPlaylist = (songId: string) => {
    if (!selectedPlaylist) return;

    const updatedPlaylist = {
      ...selectedPlaylist,
      songs: selectedPlaylist.songs.filter(s => s.id !== songId)
    };
    
    updatePlaylist(updatedPlaylist);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // If no playlist is selected, show the playlist overview
  if (!selectedPlaylist) {
    return (
      <div className="flex flex-col gap-8 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-green-500">Playlists</h1>
            <p className="text-gray-400 text-lg">Create and manage your music playlists</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg text-white font-medium transition-colors"
          >
            <FaPlus />
            Create Playlist
          </button>
        </div>

        {/* Playlists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors cursor-pointer group"
              onClick={() => setSelectedPlaylist(playlist)}
            >
              <div className={`w-full h-32 ${playlist.coverColor} rounded-lg mb-4 flex items-center justify-center`}>
                <FaMusic className="text-white text-3xl" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-1 truncate">{playlist.name}</h3>
              <p className="text-gray-400 text-sm mb-2 line-clamp-2">{playlist.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs">
                  {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
                </span>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingPlaylist(playlist);
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePlaylist(playlist.id);
                    }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {playlists.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <FaMusic className="mx-auto text-6xl mb-4 opacity-50" />
            <h2 className="text-xl mb-2">No playlists yet</h2>
            <p className="mb-6">Create your first playlist to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg text-white transition-colors"
            >
              Create Playlist
            </button>
          </div>
        )}

        {/* Create Playlist Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-white">Create New Playlist</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Playlist name"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <textarea
                  placeholder="Description (optional)"
                  value={newPlaylistDescription}
                  onChange={(e) => setNewPlaylistDescription(e.target.value)}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-24 resize-none"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={createPlaylist}
                  className="flex-1 bg-green-500 hover:bg-green-600 py-2 rounded-lg text-white transition-colors"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewPlaylistName("");
                    setNewPlaylistDescription("");
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-500 py-2 rounded-lg text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Playlist Modal */}
        {editingPlaylist && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-white">Edit Playlist</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  value={editingPlaylist.name}
                  onChange={(e) => setEditingPlaylist({...editingPlaylist, name: e.target.value})}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <textarea
                  value={editingPlaylist.description}
                  onChange={(e) => setEditingPlaylist({...editingPlaylist, description: e.target.value})}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-24 resize-none"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => updatePlaylist(editingPlaylist)}
                  className="flex-1 bg-green-500 hover:bg-green-600 py-2 rounded-lg text-white transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingPlaylist(null)}
                  className="flex-1 bg-gray-600 hover:bg-gray-500 py-2 rounded-lg text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Show individual playlist view
  return (
    <div className="flex flex-col gap-8 p-8">
      {/* Playlist Header */}
      <div className="flex items-center gap-6">
        <div className={`w-48 h-48 ${selectedPlaylist.coverColor} rounded-lg flex items-center justify-center`}>
          <FaMusic className="text-white text-6xl" />
        </div>
        <div className="flex-1">
          <p className="text-gray-400 text-sm uppercase tracking-wide mb-2">Playlist</p>
          <h1 className="text-4xl font-bold mb-2 text-white">{selectedPlaylist.name}</h1>
          <p className="text-gray-400 mb-4">{selectedPlaylist.description}</p>
          <div className="flex items-center gap-4 text-gray-400 text-sm">
            <span>{selectedPlaylist.songs.length} {selectedPlaylist.songs.length === 1 ? 'song' : 'songs'}</span>
            <span>•</span>
            <span>Created {formatDate(selectedPlaylist.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSelectedPlaylist(null)}
          className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg text-white transition-colors"
        >
          ← Back to Playlists
        </button>
        <button
          onClick={() => setShowAddSongModal(true)}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-white transition-colors"
        >
          <FaPlus />
          Add Songs
        </button>
        {selectedPlaylist.songs.length > 0 && (
          <button
            onClick={() => setPlayAllIndex(0)}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg text-white transition-colors"
          >
            <FaPlay />
            Play All
          </button>
        )}
      </div>

      {/* Songs List */}
      <div className="bg-gray-900 rounded-lg">
        {selectedPlaylist.songs.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <FaMusic className="mx-auto text-4xl mb-4 opacity-50" />
            <h3 className="text-lg mb-2">No songs in this playlist</h3>
            <p className="mb-4">Add some songs to get started</p>
            <button
              onClick={() => setShowAddSongModal(true)}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-white transition-colors"
            >
              Add Songs
            </button>
          </div>
        ) : (
          <div className="p-4">
            <div className="space-y-2">
              {selectedPlaylist.songs.map((song, index) => (
                <div key={song.id} className="flex items-center gap-4 p-3 hover:bg-gray-800 rounded-lg transition-colors group">
                  <span className="text-gray-400 text-sm w-8">{index + 1}</span>
                  <button
                    className="bg-green-500 hover:bg-green-600 p-2 rounded-full text-white flex items-center justify-center"
                    onClick={() => onPlay && onPlay(song)}
                  >
                    <FaPlay />
                  </button>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">{song.title}</h3>
                    <p className="text-gray-400 text-sm">Song</p>
                  </div>
                  <button
                    onClick={() => removeSongFromPlaylist(song.id)}
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <FaTrash />
                  </button>
                  {/* Hidden audio element for Play All */}
                  {playAllIndex === index && (
                    <audio
                      ref={audioRef}
                      src={song.file}
                      autoPlay
                      onEnded={() => {
                        if (selectedPlaylist.songs[playAllIndex + 1]) {
                          setPlayAllIndex(playAllIndex + 1);
                        } else {
                          setPlayAllIndex(null);
                        }
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Song Modal */}
      {showAddSongModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Add Songs to "{selectedPlaylist.name}"</h2>
              <button
                onClick={() => setShowAddSongModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {allSongs.map((song) => {
                const isInPlaylist = selectedPlaylist.songs.some(s => s.id === song.id);
                return (
                  <div key={song.id} className="flex items-center justify-between p-3 hover:bg-gray-700 rounded-lg">
                    <span className="text-white truncate">{song.title}</span>
                    <button
                      onClick={() => addSongToPlaylist(song)}
                      disabled={isInPlaylist}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        isInPlaylist 
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {isInPlaylist ? 'Added' : 'Add'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}