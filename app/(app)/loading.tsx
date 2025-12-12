import LoadingSpinner from "@/components/LoadingSpinner";

function Loading() {
  return (
    <div className="min-h-screen bg-background text-white">
      {/* Animated gradient mesh background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-zinc-600/20 rounded-full blur-[150px] animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-zinc-500/15 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-[40%] right-[20%] w-[400px] h-[400px] bg-zinc-400/10 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Loading spinner */}
      <LoadingSpinner text="Loading..." isFullScreen size="lg" />
    </div>
  );
}

export default Loading;
