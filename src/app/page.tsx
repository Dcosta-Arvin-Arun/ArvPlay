import ClientSongAudioWrapper from "../components/ClientSongAudioWrapper";
import WorkInProgressOverlay from "../components/WorkInProgressOverlay";

export default function Home() {
  return (
    <div className="flex flex-col gap-8 p-8 relative">
      <WorkInProgressOverlay />
      <div className="mb-4">
        <h1 className="text-4xl font-bold mb-2 text-green-500">ArvPlay</h1>
        <p className="text-gray-400 text-lg">
          Stream your favorite music with a beautiful, modern interface.
        </p>
      </div>
      <ClientSongAudioWrapper />
    </div>
  );
}
