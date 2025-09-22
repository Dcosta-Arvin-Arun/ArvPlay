import { FaStepBackward, FaStepForward, FaPlay } from "react-icons/fa";

export default function PlayerControls() {
  return (
    <div className="flex items-center justify-center py-6 bg-gray-900 w-full min-h-[96px]">
      <div className="flex items-center gap-12 max-w-xl w-full justify-center mx-auto">
        <button className="bg-gray-800 hover:bg-gray-700 p-4 rounded-full text-2xl flex items-center justify-center transition-all duration-150">
          <FaStepBackward />
        </button>
        <button className="bg-green-500 hover:bg-green-600 p-6 rounded-full text-3xl text-white shadow-lg flex items-center justify-center transition-all duration-150">
          <FaPlay />
        </button>
        <button className="bg-gray-800 hover:bg-gray-700 p-4 rounded-full text-2xl flex items-center justify-center transition-all duration-150">
          <FaStepForward />
        </button>
      </div>
    </div>
  );
}
