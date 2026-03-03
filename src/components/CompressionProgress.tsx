import { Download, RotateCcw, FileVideo, ArrowDown } from "lucide-react";
import type { CompressionState } from "@/hooks/useVideoCompressor";

interface CompressionProgressProps {
  state: CompressionState;
  onReset: () => void;
}

function formatSize(bytes: number) {
  if (bytes === 0) return "0 B";
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  const kb = bytes / 1024;
  return `${kb.toFixed(0)} KB`;
}

const CompressionProgress = ({ state, onReset }: CompressionProgressProps) => {
  const { status, progress, log, outputUrl, outputSize, inputSize, inputName } = state;

  const reduction = inputSize > 0 ? ((1 - outputSize / inputSize) * 100).toFixed(1) : "0";
  const outputFileName = inputName.replace(/\.[^.]+$/, "") + "_compressed.mp4";

  if (status === "loading" || status === "compressing") {
    return (
      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileVideo className="w-4 h-4 text-primary animate-pulse" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {status === "loading" ? "Loading FFmpeg..." : "Compressing..."}
            </p>
            <p className="text-xs text-muted-foreground font-mono truncate max-w-xs">{log}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-primary">{progress}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.max(progress, status === "loading" ? 5 : 0)}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (status === "done" && outputUrl) {
    return (
      <div className="bg-card rounded-xl border border-primary/30 p-6 space-y-4 glow-green">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileVideo className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Compression Complete</p>
              <p className="text-xs text-muted-foreground font-mono">{outputFileName}</p>
            </div>
          </div>
          <button onClick={onReset} className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-muted rounded-lg p-3 text-center terminal-border">
            <div className="text-xs text-muted-foreground mb-1">Original</div>
            <div className="font-mono text-sm text-foreground font-semibold">{formatSize(inputSize)}</div>
          </div>
          <div className="bg-muted rounded-lg p-3 text-center terminal-border flex flex-col items-center justify-center">
            <ArrowDown className="w-4 h-4 text-primary mb-0.5" />
            <div className="font-mono text-sm text-primary font-semibold">{reduction}%</div>
          </div>
          <div className="bg-muted rounded-lg p-3 text-center terminal-border">
            <div className="text-xs text-muted-foreground mb-1">Compressed</div>
            <div className="font-mono text-sm text-primary font-semibold glow-text">{formatSize(outputSize)}</div>
          </div>
        </div>

        {/* Preview */}
        <div className="rounded-lg overflow-hidden border border-border bg-muted">
          <video
            src={outputUrl}
            controls
            className="w-full max-h-64 object-contain bg-background"
          />
        </div>

        {/* Download */}
        <a
          href={outputUrl}
          download={outputFileName}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          <Download className="w-4 h-4" />
          Download Compressed Video
        </a>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="bg-card rounded-xl border border-destructive/30 p-6 space-y-3">
        <p className="text-sm font-semibold text-destructive">Compression Failed</p>
        <p className="text-xs text-muted-foreground font-mono">{log}</p>
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-sm text-foreground bg-secondary hover:bg-secondary/80 px-4 py-2 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Try Again
        </button>
      </div>
    );
  }

  return null;
};

export default CompressionProgress;
