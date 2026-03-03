import type { CompressionSettings } from "@/hooks/useVideoCompressor";
import { Settings } from "lucide-react";

interface CompressionControlsProps {
  settings: CompressionSettings;
  onChange: (s: CompressionSettings) => void;
  disabled?: boolean;
}

const resolutionOptions = [
  { value: "1280:720" as const, label: "720p" },
  { value: "854:480" as const, label: "480p" },
  { value: "640:360" as const, label: "360p" },
];

const presetOptions = [
  { value: "ultrafast" as const, label: "Ultrafast", desc: "Fastest, larger file" },
  { value: "fast" as const, label: "Fast", desc: "Balanced" },
  { value: "medium" as const, label: "Medium", desc: "Slower, smaller file" },
];

const audioOptions = [
  { value: "64k", label: "64 kbps" },
  { value: "96k", label: "96 kbps" },
  { value: "128k", label: "128 kbps" },
];

const CompressionControls = ({ settings, onChange, disabled }: CompressionControlsProps) => {
  return (
    <div className={`bg-card rounded-xl border border-border p-5 space-y-5 ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      <div className="flex items-center gap-2">
        <Settings className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Compression Settings</h3>
      </div>

      {/* Resolution */}
      <div>
        <label className="block text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wider">Resolution</label>
        <div className="grid grid-cols-3 gap-2">
          {resolutionOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...settings, resolution: opt.value })}
              className={`py-2 px-3 rounded-lg text-sm font-mono font-medium transition-colors border ${
                settings.resolution === opt.value
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-muted border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quality CRF */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Quality (CRF)</label>
          <span className="text-xs font-mono text-primary">{settings.quality}</span>
        </div>
        <input
          type="range"
          min={18}
          max={40}
          value={settings.quality}
          onChange={(e) => onChange({ ...settings, quality: Number(e.target.value) })}
          className="w-full accent-primary h-1.5"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Higher quality</span>
          <span>Smaller file</span>
        </div>
      </div>

      {/* Preset */}
      <div>
        <label className="block text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wider">Speed Preset</label>
        <div className="grid grid-cols-3 gap-2">
          {presetOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...settings, preset: opt.value })}
              className={`py-2 px-3 rounded-lg text-center transition-colors border ${
                settings.preset === opt.value
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-muted border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              }`}
            >
              <div className="text-sm font-mono font-medium">{opt.label}</div>
              <div className="text-[10px] mt-0.5 opacity-70">{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Audio */}
      <div>
        <label className="block text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wider">Audio Bitrate</label>
        <div className="grid grid-cols-3 gap-2">
          {audioOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...settings, audioBitrate: opt.value })}
              className={`py-2 px-3 rounded-lg text-sm font-mono font-medium transition-colors border ${
                settings.audioBitrate === opt.value
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-muted border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompressionControls;
