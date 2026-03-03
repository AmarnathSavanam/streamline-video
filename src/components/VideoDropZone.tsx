import { useState, useCallback } from "react";
import { Upload, FileVideo } from "lucide-react";

interface VideoDropZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

const VideoDropZone = ({ onFileSelect, disabled }: VideoDropZoneProps) => {
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("video/") && !file.name.match(/\.(mp4|mkv|avi|mov|webm|flv|wmv)$/i)) return;
    onFileSelect(file);
  }, [onFileSelect]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={`flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-xl p-14 cursor-pointer transition-all duration-200 ${
        disabled ? "opacity-50 pointer-events-none" : ""
      } ${
        dragging
          ? "border-primary bg-primary/5 scale-[1.01]"
          : "border-border hover:border-muted-foreground hover:bg-card"
      }`}
    >
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
        dragging ? "bg-primary/10" : "bg-muted"
      }`}>
        {dragging ? (
          <FileVideo className="w-8 h-8 text-primary" />
        ) : (
          <Upload className="w-8 h-8 text-muted-foreground" />
        )}
      </div>
      <div className="text-center">
        <p className="text-foreground font-medium mb-1">
          Drop your video here or <span className="text-primary underline">browse</span>
        </p>
        <p className="text-xs text-muted-foreground">
          MP4, MOV, AVI, WebM, MKV — processed entirely in your browser
        </p>
      </div>
      <input type="file" accept="video/*,.mp4,.mkv,.avi,.mov,.webm,.flv,.wmv" onChange={onInput} className="hidden" disabled={disabled} />
    </label>
  );
};

export default VideoDropZone;
