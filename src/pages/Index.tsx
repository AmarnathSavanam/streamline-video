import { Terminal, Settings, Gauge, Cloud, AlertTriangle, Zap } from "lucide-react";
import CodeBlock from "@/components/CodeBlock";
import SectionCard from "@/components/SectionCard";
import BitrateCalculator from "@/components/BitrateCalculator";
import FileDropZone from "@/components/FileDropZone";

const ffmpegCommand = `ffmpeg -i input.mp4 \\
  -c:v libx264 \\
  -preset fast \\
  -crf 28 \\
  -vf "scale=1280:720" \\
  -maxrate 500k \\
  -bufsize 1000k \\
  -c:a aac \\
  -b:a 96k \\
  -ac 2 \\
  -movflags +faststart \\
  -y output_720p.mp4`;

const twoPassFirst = `ffmpeg -i input.mp4 \\
  -c:v libx264 \\
  -preset fast \\
  -b:v 100k \\
  -vf "scale=1280:720" \\
  -pass 1 \\
  -an -f null /dev/null`;

const twoPassSecond = `ffmpeg -i input.mp4 \\
  -c:v libx264 \\
  -preset fast \\
  -b:v 100k \\
  -maxrate 200k \\
  -bufsize 400k \\
  -vf "scale=1280:720" \\
  -pass 2 \\
  -c:a aac \\
  -b:a 64k \\
  -ac 2 \\
  -movflags +faststart \\
  -y output_2pass.mp4`;

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container max-w-4xl mx-auto py-8 px-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center glow-green">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Video Compression Workflow</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">
            Fast MP4 Compression
          </h1>
          <p className="text-muted-foreground max-w-xl">
            H.264 + AAC workflow to squeeze a 2-hour video under 100 MB. Commands, settings, and bitrate math included.
          </p>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto py-8 px-4 space-y-6">
        {/* Reality Check */}
        <div className="bg-warning/5 border border-warning/20 rounded-lg p-5 flex gap-4">
          <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground mb-1">Reality Check</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              100 MB for 2 hours = ~111 kbps total. After 64-96 kbps audio, only <strong className="text-warning">~15-47 kbps</strong> remains for video — far below what 720p needs (1,500+ kbps). 
              Expect <strong>significant quality loss</strong> at 720p. Consider 480p/360p, or increase your target to 250-500 MB for watchable 720p.
            </p>
          </div>
        </div>

        {/* Calculator */}
        <BitrateCalculator />

        {/* File Drop Zone */}
        <FileDropZone />

        {/* FFmpeg Single Pass */}
        <SectionCard title="FFmpeg — Single Pass (CRF)" icon={<Terminal className="w-5 h-5" />} accent="green">
          <p className="text-sm text-muted-foreground mb-4">
            Best balance of speed and quality. CRF 28 is aggressive; <code className="font-mono text-foreground bg-muted px-1 rounded">-maxrate</code> caps the bitrate to stay within size targets.
          </p>
          <CodeBlock code={ffmpegCommand} label="Single-pass command" />
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            {[
              { label: "Codec", value: "H.264" },
              { label: "Preset", value: "fast" },
              { label: "CRF", value: "28" },
              { label: "Audio", value: "AAC 96k" },
            ].map((item) => (
              <div key={item.label} className="bg-muted rounded-md p-2.5 text-center">
                <div className="text-muted-foreground mb-1">{item.label}</div>
                <div className="text-primary font-semibold">{item.value}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* FFmpeg Two Pass */}
        <SectionCard title="FFmpeg — Two Pass (Exact Size)" icon={<Terminal className="w-5 h-5" />} accent="blue">
          <p className="text-sm text-muted-foreground mb-4">
            For strict size targets. Pass 1 analyzes, Pass 2 encodes. Slower but predictable output size.
          </p>
          <div className="space-y-4">
            <CodeBlock code={twoPassFirst} label="Pass 1 — Analysis" />
            <CodeBlock code={twoPassSecond} label="Pass 2 — Encode" />
          </div>
        </SectionCard>

        {/* HandBrake */}
        <SectionCard title="HandBrake Settings (GUI)" icon={<Settings className="w-5 h-5" />} accent="amber">
          <div className="space-y-3">
            {[
              { step: "1", title: "Source", desc: "Open your MP4 file" },
              { step: "2", title: "Preset", desc: 'Select "Fast 720p30"' },
              { step: "3", title: "Video Tab", desc: "Codec: H.264 (x264) · Quality: RF 28-32 · Preset: Fast · Profile: Main · Level: 4.0" },
              { step: "4", title: "Dimensions", desc: "Width: 1280 · Height: 720 · Anamorphic: None" },
              { step: "5", title: "Audio Tab", desc: "Codec: AAC · Bitrate: 96 kbps · Mixdown: Stereo" },
              { step: "6", title: "Web Optimized", desc: 'Check "Web Optimized" (adds faststart flag)' },
              { step: "7", title: "Encode", desc: "Start Encode and check output size" },
            ].map((item) => (
              <div key={item.step} className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-warning/10 text-warning text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {item.step}
                </div>
                <div>
                  <span className="font-semibold text-foreground text-sm">{item.title}</span>
                  <span className="text-muted-foreground text-sm"> — {item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Bitrate Reference */}
        <SectionCard title="Bitrate Reference (2-hour content)" icon={<Gauge className="w-5 h-5" />} accent="green">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border">
                  <th className="py-2 pr-4">Target</th>
                  <th className="py-2 pr-4">Video kbps</th>
                  <th className="py-2 pr-4">Audio kbps</th>
                  <th className="py-2 pr-4">Resolution</th>
                  <th className="py-2">Quality</th>
                </tr>
              </thead>
              <tbody className="text-foreground">
                {[
                  { target: "100 MB", video: "~15-47", audio: "64-96", res: "360p", quality: "Low", qColor: "text-destructive" },
                  { target: "250 MB", video: "~180", audio: "96", res: "480p", quality: "Acceptable", qColor: "text-warning" },
                  { target: "500 MB", video: "~460", audio: "128", res: "720p", quality: "Decent", qColor: "text-warning" },
                  { target: "1 GB", video: "~1,000", audio: "128", res: "720p", quality: "Good", qColor: "text-primary" },
                  { target: "2 GB", video: "~2,100", audio: "192", res: "1080p", quality: "Great", qColor: "text-primary" },
                ].map((row) => (
                  <tr key={row.target} className="border-b border-border/50">
                    <td className="py-2.5 pr-4 font-semibold">{row.target}</td>
                    <td className="py-2.5 pr-4">{row.video}</td>
                    <td className="py-2.5 pr-4">{row.audio}</td>
                    <td className="py-2.5 pr-4">{row.res}</td>
                    <td className={`py-2.5 font-semibold ${row.qColor}`}>{row.quality}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* Streaming Optimization */}
        <SectionCard title="Streaming Platform Tips" icon={<Cloud className="w-5 h-5" />} accent="blue">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                platform: "Cloudinary",
                tips: ["Upload raw, use eager transforms", "f_auto,q_auto for adaptive", "Set streaming_profile"],
              },
              {
                platform: "Firebase Storage",
                tips: ["Use -movflags +faststart", "Set Content-Type: video/mp4", "Serve via CDN URL"],
              },
              {
                platform: "General Web",
                tips: ["Always faststart for progressive", "Consider HLS for long content", "Add preload='metadata'"],
              },
            ].map((item) => (
              <div key={item.platform} className="bg-muted rounded-lg p-4 terminal-border">
                <h4 className="font-semibold text-foreground text-sm mb-2">{item.platform}</h4>
                <ul className="space-y-1.5">
                  {item.tips.map((tip, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex gap-2">
                      <span className="text-primary">›</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Footer */}
        <footer className="text-center py-8 text-xs text-muted-foreground font-mono">
          <span className="text-primary animate-blink">▊</span> fast-compress v1.0
        </footer>
      </main>
    </div>
  );
};

export default Index;
