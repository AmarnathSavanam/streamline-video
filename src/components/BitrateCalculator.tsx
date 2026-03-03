import { useState } from "react";
import { Calculator } from "lucide-react";

const BitrateCalculator = () => {
  const [duration, setDuration] = useState(120); // minutes
  const [targetSize, setTargetSize] = useState(100); // MB
  const [audioBitrate, setAudioBitrate] = useState(96); // kbps

  const totalSeconds = duration * 60;
  const totalBitsAvailable = targetSize * 8 * 1024; // kbits
  const totalBitrateKbps = totalBitsAvailable / totalSeconds;
  const videoBitrateKbps = Math.max(0, totalBitrateKbps - audioBitrate);

  const getQualityLabel = (vbr: number) => {
    if (vbr >= 2500) return { label: "Excellent (1080p)", color: "text-primary" };
    if (vbr >= 1500) return { label: "Good (720p)", color: "text-primary" };
    if (vbr >= 800) return { label: "Acceptable (720p)", color: "text-warning" };
    if (vbr >= 400) return { label: "Low (480p recommended)", color: "text-warning" };
    return { label: "Very low (360p or lower)", color: "text-destructive" };
  };

  const quality = getQualityLabel(videoBitrateKbps);

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Bitrate Calculator</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wider">
            Duration (min)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full bg-muted border border-border rounded-md px-3 py-2 font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wider">
            Target Size (MB)
          </label>
          <input
            type="number"
            value={targetSize}
            onChange={(e) => setTargetSize(Number(e.target.value))}
            className="w-full bg-muted border border-border rounded-md px-3 py-2 font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wider">
            Audio (kbps)
          </label>
          <input
            type="number"
            value={audioBitrate}
            onChange={(e) => setAudioBitrate(Number(e.target.value))}
            className="w-full bg-muted border border-border rounded-md px-3 py-2 font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="bg-muted rounded-lg p-4 terminal-border space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Total Bitrate</span>
          <span className="font-mono text-foreground">{totalBitrateKbps.toFixed(0)} kbps</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Video Bitrate</span>
          <span className="font-mono text-primary glow-text">{videoBitrateKbps.toFixed(0)} kbps</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Audio Bitrate</span>
          <span className="font-mono text-foreground">{audioBitrate} kbps</span>
        </div>
        <div className="border-t border-border pt-2 mt-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Expected Quality</span>
            <span className={`font-mono text-sm font-semibold ${quality.color}`}>{quality.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BitrateCalculator;
