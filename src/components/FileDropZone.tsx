import { useState, useCallback } from "react";
import { Upload, FileVideo, X } from "lucide-react";
import CodeBlock from "./CodeBlock";

interface VideoInfo {
  name: string;
  sizeMB: number;
}

const FileDropZone = () => {
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [dragging, setDragging] = useState(false);
  const [targetMB, setTargetMB] = useState(100);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("video/")) return;
    setVideoInfo({
      name: file.name,
      sizeMB: Math.round((file.size / (1024 * 1024)) * 10) / 10,
    });
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const compressionRatio = videoInfo ? (targetMB / videoInfo.sizeMB) : 1;
  const crf = compressionRatio < 0.05 ? 34 : compressionRatio < 0.1 ? 32 : compressionRatio < 0.3 ? 28 : 24;
  const resolution = compressionRatio < 0.05 ? "640:360" : compressionRatio < 0.15 ? "854:480" : "1280:720";
  const resLabel = compressionRatio < 0.05 ? "360p" : compressionRatio < 0.15 ? "480p" : "720p";
  const audioBr = compressionRatio < 0.1 ? "64k" : "96k";

  const generatedCmd = videoInfo
    ? `ffmpeg -i "${videoInfo.name}" \\
  -c:v libx264 \\
  -preset fast \\
  -crf ${crf} \\
  -vf "scale=${resolution}" \\
  -c:a aac \\
  -b:a ${audioBr} \\
  -ac 2 \\
  -movflags +faststart \\
  -y "${videoInfo.name.replace(/\.[^.]+$/, "")}_compressed.mp4"`
    : "";

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center gap-3 mb-4">
        <FileVideo className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Drop Your Video</h2>
      </div>

      {!videoInfo ? (
        <label
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-lg p-10 cursor-pointer transition-colors ${
            dragging ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
          }`}
        >
          <Upload className={`w-8 h-8 ${dragging ? "text-primary" : "text-muted-foreground"}`} />
          <p className="text-sm text-muted-foreground text-center">
            Drag & drop a video file or <span className="text-primary underline">browse</span>
          </p>
          <p className="text-xs text-muted-foreground">File is read locally — nothing is uploaded</p>
          <input type="file" accept="video/*" onChange={onFileSelect} className="hidden" />
        </label>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-muted rounded-lg p-3 terminal-border">
            <div className="flex items-center gap-3">
              <FileVideo className="w-4 h-4 text-primary" />
              <div>
                <p className="text-sm font-mono text-foreground truncate max-w-[200px] sm:max-w-none">{videoInfo.name}</p>
                <p className="text-xs text-muted-foreground">{videoInfo.sizeMB} MB</p>
              </div>
            </div>
            <button onClick={() => setVideoInfo(null)} className="p-1 hover:bg-secondary rounded-md text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="block text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wider">
              Target Size (MB)
            </label>
            <input
              type="number"
              value={targetMB}
              onChange={(e) => setTargetMB(Number(e.target.value))}
              className="w-full bg-muted border border-border rounded-md px-3 py-2 font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs font-mono">
            <div className="bg-muted rounded-md p-2.5 text-center">
              <div className="text-muted-foreground mb-1">CRF</div>
              <div className="text-primary font-semibold">{crf}</div>
            </div>
            <div className="bg-muted rounded-md p-2.5 text-center">
              <div className="text-muted-foreground mb-1">Resolution</div>
              <div className="text-primary font-semibold">{resLabel}</div>
            </div>
            <div className="bg-muted rounded-md p-2.5 text-center">
              <div className="text-muted-foreground mb-1">Ratio</div>
              <div className="text-warning font-semibold">{(compressionRatio * 100).toFixed(1)}%</div>
            </div>
          </div>

          <CodeBlock code={generatedCmd} label="Generated FFmpeg Command" />
        </div>
      )}
    </div>
  );
};

export default FileDropZone;
