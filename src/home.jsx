import { useState } from "react";
import BubblesPage from "./components/bubble";

const BUBBLE_COLORS = [
  {
    name: "Ocean Blue",
    value: "#3B82F6",
    gradient: "from-blue-400 to-blue-600",
  },
  {
    name: "Sunset Orange",
    value: "#F97316",
    gradient: "from-orange-400 to-orange-600",
  },
  {
    name: "Forest Green",
    value: "#10B981",
    gradient: "from-emerald-400 to-emerald-600",
  },
  {
    name: "Royal Purple",
    value: "#8B5CF6",
    gradient: "from-violet-400 to-violet-600",
  },
  {
    name: "Rose Pink",
    value: "#EC4899",
    gradient: "from-pink-400 to-pink-600",
  },
  {
    name: "Golden Yellow",
    value: "#F59E0B",
    gradient: "from-amber-400 to-amber-600",
  },
];

export function App() {
  const [selectedColor, setSelectedColor] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [bubbles, setBubbles] = useState(false);
  const [bubble, setBubble] = useState({
    color: "#3B82F6",
    wallet: "0x1234567890abcdef1234567890abcdef12345678",
  });

  const handleJoinBubble = () => {
    if (!selectedColor) return;
    const bubbleData = {
      color: selectedColor,
      wallet:
        walletAddress ||
        `0x${Math.random().toString(16).substr(2, 8)}...${Math.random()
          .toString(16)
          .substr(2, 4)}`,
    };
    setBubble(bubbleData);
    setBubbles(true);
  };

  return !bubbles ? (
    <div className="w-[100vw] min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🫧 BubbleWorld</h1>
          <p className="text-white/80">
            Choose your bubble and join the floating universe
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-white text-lg font-medium mb-4 block">
              Choose Your Bubble Color
            </label>
            <div className="grid grid-cols-2 gap-3">
              {BUBBLE_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={`relative p-4 rounded-2xl border-2 transition-all duration-300 bg-transparent backdrop:blur-lg ${
                    selectedColor === color.value
                      ? "border-white scale-105 shadow-lg"
                      : "border-white/30 hover:border-white/60 hover:scale-102"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${color.gradient} mx-auto mb-2 shadow-lg`}
                  />
                  <p className="text-white text-sm font-medium">{color.name}</p>
                  {selectedColor === color.value && (
                    <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="wallet"
              className="text-white text-lg font-medium mb-2 block"
            >
              Wallet Address (Optional)
            </label>
            <input
              id="wallet"
              type="text"
              placeholder="4Xz1ACZ6q...HSjAv or leave empty for random"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="w-full h-11 rounded-md px-4 bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-white/60 backdrop:blur-md"
            />
          </div>

          <button
            onClick={handleJoinBubble}
            disabled={!selectedColor}
            className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl"
          >
            🫧 Join the Bubble Universe
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm">
            Your bubble will float among others in the shared space
          </p>
        </div>
      </div>
    </div>
  ) : (
    <BubblesPage setOpen={setBubbles} open={bubbles} bubble={bubble} />
  );
}
