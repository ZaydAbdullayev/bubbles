import { useEffect, useState } from "react";
import { RiArrowLeftWideFill, RiTwitterXFill } from "react-icons/ri";
import { TiUser } from "react-icons/ti";

export default function BubblesPage({ setOpen }) {
  const [bubbles, setBubbles] = useState([]);
  const [newBubbleId, setNewBubbleId] = useState("");

  useEffect(() => {
    const generateWalletAddress = () => {
      const base58 =
        "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
      let address = "";

      for (let i = 0; i < 44; i++) {
        address += base58[Math.floor(Math.random() * base58.length)];
      }

      return address;
    };

    const BUBBLE_COLORS = [
      "#3B82F6",
      "#F97316",
      "#10B981",
      "#8B5CF6",
      "#EC4899",
      "#F59E0B",
      "#EF4444",
      "#06B6D4",
      "#84CC16",
      "#F43F5E",
      "#8B5A2B",
      "#6366F1",
    ];

    const createRandomBubble = (timestamp) => ({
      color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)],
      wallet: generateWalletAddress(),
      timestamp,
      id: `bubble-${timestamp}-${Math.random()}`,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    });

    // Load existing bubbles from localStorage
    const storedBubbles = JSON.parse(localStorage.getItem("bubbles") || "[]");

    // Generate initial fake bubbles if we don't have many
    const initialBubbles = [...storedBubbles];
    const currentTime = Date.now();

    // Add 8-15 initial fake bubbles to make it feel active
    const initialFakeCount = Math.floor(Math.random() * 8) + 8;
    for (let i = 0; i < initialFakeCount; i++) {
      const bubbleTime = currentTime - Math.random() * 300000; // Spread over last 5 minutes
      initialBubbles.push(createRandomBubble(bubbleTime));
    }

    const processedBubbles = initialBubbles.map((bubble, index) => ({
      ...bubble,
      id: bubble.id || `bubble-${bubble.timestamp}-${index}`,
      x: bubble.x || Math.random() * 80 + 10,
      y: bubble.y || Math.random() * 80 + 10,
      vx: bubble.vx || (Math.random() - 0.5) * 0.5,
      vy: bubble.vy || (Math.random() - 0.5) * 0.5,
    }));

    setBubbles(processedBubbles);

    // Mark the newest real bubble (from user) for animation
    if (storedBubbles.length > 0) {
      const newest = processedBubbles.find((b) =>
        storedBubbles.some((sb) => sb.timestamp === b.timestamp)
      );
      if (newest) {
        setNewBubbleId(newest.id);
        setTimeout(() => setNewBubbleId(""), 2000);
      }
    }

    // Set up interval to add new random bubbles periodically
    const addRandomBubble = () => {
      const newBubble = createRandomBubble(Date.now());
      setBubbles((prev) => [...prev, newBubble]);
      setNewBubbleId(newBubble.id);
      setTimeout(() => setNewBubbleId(""), 2000);
    };

    // Add new bubbles at random intervals (every 3-8 seconds)
    const scheduleNextBubble = () => {
      const delay = 5 * 60 * 1000; // 5 dakika = 300000 ms
      setTimeout(() => {
        addRandomBubble();
        scheduleNextBubble(); // Schedule the next one
      }, delay);
    };

    // Start the bubble generation cycle
    scheduleNextBubble();

    // Cleanup function to prevent memory leaks
    return () => {
      // The timeouts will be cleaned up when component unmounts
    };
  }, []);

  useEffect(() => {
    // Much gentler, slower floating animation like real bubbles
    const interval = setInterval(() => {
      setBubbles((prev) =>
        prev.map((bubble, index) => {
          const time = Date.now() / 1000;
          const uniqueOffset = index * 0.7; // Each bubble has unique timing

          // Very gentle floating motion - much slower and smoother
          const floatX = Math.sin(time * 0.08 + uniqueOffset) * 0.3;
          const floatY = Math.cos(time * 0.06 + uniqueOffset * 1.2) * 0.25;
          const driftX = Math.sin(time * 0.03 + uniqueOffset * 2) * 0.15;
          const driftY = Math.cos(time * 0.04 + uniqueOffset * 1.5) * 0.12;

          // Very subtle secondary motion for more realism
          const microFloatX = Math.sin(time * 0.15 + uniqueOffset * 3) * 0.08;
          const microFloatY = Math.cos(time * 0.12 + uniqueOffset * 2.5) * 0.06;

          let newX = bubble.x + floatX + driftX + microFloatX;
          let newY = bubble.y + floatY + driftY + microFloatY;

          // Very gentle boundary constraints (soft bouncing)
          if (newX < 5) newX = 5 + Math.abs(floatX) * 0.5;
          if (newX > 95) newX = 95 - Math.abs(floatX) * 0.5;
          if (newY < 5) newY = 5 + Math.abs(floatY) * 0.5;
          if (newY > 95) newY = 95 - Math.abs(floatY) * 0.5;

          return {
            ...bubble,
            x: newX,
            y: newY,
          };
        })
      );
    }, 150); // Slower updates for smoother motion

    return () => clearInterval(interval);
  }, []);

  // Optional: Remove old bubbles to prevent infinite growth
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setBubbles((prev) => {
        // Keep only the last 50 bubbles to prevent performance issues
        if (prev.length > 50) {
          return prev.slice(-50);
        }
        return prev;
      });
    }, 60000);

    return () => clearInterval(cleanupInterval);
  }, []);

  const formatWallet = (wallet) => {
    if (wallet.length > 10) {
      return `${wallet.slice(0, 6)}...${wallet.slice(-6)}`;
    }
    return wallet;
  };

  return (
    <div className="w-[100vw] min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
        <button
          onClick={() => setOpen(false)}
          variant="outline"
          className="flex items-center bg-white/10 border-white/30 text-white hover:bg-white/20"
        >
          <RiArrowLeftWideFill className="w-4 h-4 mr-2" />
          Back
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-white bg-white/10 backdrop-blur-lg rounded-full px-6 py-3 border border-white/20">
            <RiTwitterXFill />
            <span className="font-semibold">Folllow Us</span>
          </div>
          <div className="flex items-center gap-2 text-white bg-white/10 backdrop-blur-lg rounded-full px-6 py-3 border border-white/20">
            <TiUser className="w-5 h-5" />
            <span className="font-semibold">{bubbles.length} Bubbles</span>
          </div>
        </div>
      </div>

      {/* Bubbles */}
      <div className="absolute inset-0">
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className={`absolute transition-all duration-1000 ease-out group cursor-pointer ${
              newBubbleId === bubble.id ? "animate-bounce" : ""
            }`}
            style={{
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              transform: "translate(-50%, -50%)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", // Much smoother easing
            }}
          >
            <div
              className="w-16 h-16 rounded-full shadow-2xl transition-all duration-300 group-hover:scale-125 group-hover:shadow-3xl relative"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${bubble.color}aa, ${bubble.color})`,
                boxShadow: `0 0 20px ${bubble.color}66, inset 0 0 20px rgba(255,255,255,0.3)`,
              }}
            >
              <div className="absolute top-2 left-2 w-4 h-4 bg-white/40 rounded-full blur-sm" />

              <div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"
                style={{
                  background: `radial-gradient(circle, ${bubble.color}44, transparent)`,
                  transform: "scale(2)",
                }}
              />
            </div>

            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-black/80 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">
                {formatWallet(bubble.wallet)}
              </div>
            </div>

            {newBubbleId === bubble.id && (
              <div className="absolute -inset-4 rounded-full border-2 border-white/60 animate-ping" />
            )}
          </div>
        ))}
      </div>

      {/* Empty state */}
      {bubbles.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white/60">
            <div className="text-6xl mb-4">🫧</div>
            <p className="text-xl">No bubbles yet...</p>
            <p>Be the first to join!</p>
          </div>
        </div>
      )}
    </div>
  );
}
