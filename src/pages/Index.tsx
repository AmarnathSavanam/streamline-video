import { Zap, Shield, Cpu } from "lucide-react";
import VideoDropZone from "@/components/VideoDropZone";
import CompressionControls from "@/components/CompressionControls";
import CompressionProgress from "@/components/CompressionProgress";
import { useVideoCompressor } from "@/hooks/useVideoCompressor";

const Index = () => {
  const { state, settings, setSettings, compress, reset } = useVideoCompressor();
  const isProcessing = state.status === "loading" || state.status === "compressing";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container max-w-3xl mx-auto py-8 px-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center glow-green">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
              Browser Video Compressor
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">
            Compress Videos Instantly
          </h1>
          <p className="text-muted-foreground max-w-lg">
            H.264 compression powered by FFmpeg.wasm — runs entirely in your browser. No uploads, no servers, fully private.
          </p>

          <div className="flex gap-4 mt-5">
            {[
              { icon: <Shield className="w-3.5 h-3.5" />, label: "100% Private" },
              { icon: <Cpu className="w-3.5 h-3.5" />, label: "Runs Locally" },
              { icon: <Zap className="w-3.5 h-3.5" />, label: "No Upload" },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="text-primary">{badge.icon}</span>
                {badge.label}
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="container max-w-3xl mx-auto py-8 px-4 space-y-6">
        {/* Drop Zone — only show when idle */}
        {state.status === "idle" && (
          <>
            <VideoDropZone onFileSelect={compress} disabled={isProcessing} />
            <CompressionControls settings={settings} onChange={setSettings} disabled={isProcessing} />
          </>
        )}

        {/* Progress / Result */}
        <CompressionProgress state={state} onReset={reset} />

        {/* Footer */}
        <footer className="text-center pt-6 pb-10 text-xs text-muted-foreground font-mono">
          <span className="text-primary animate-blink">▊</span> FFmpeg.wasm · H.264 · AAC · All client-side
        </footer>
      </main>
    </div>
  );
};

export default Index;
