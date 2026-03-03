import { useRef, useState, useCallback } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";

export type CompressionSettings = {
  resolution: "1280:720" | "854:480" | "640:360";
  quality: number; // CRF value
  audioBitrate: string;
  preset: "ultrafast" | "fast" | "medium";
};

export type CompressionState = {
  status: "idle" | "loading" | "compressing" | "done" | "error";
  progress: number;
  log: string;
  outputUrl: string | null;
  outputSize: number;
  inputSize: number;
  inputName: string;
};

const DEFAULT_SETTINGS: CompressionSettings = {
  resolution: "1280:720",
  quality: 28,
  audioBitrate: "96k",
  preset: "fast",
};

export function useVideoCompressor() {
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const [settings, setSettings] = useState<CompressionSettings>(DEFAULT_SETTINGS);
  const [state, setState] = useState<CompressionState>({
    status: "idle",
    progress: 0,
    log: "",
    outputUrl: null,
    outputSize: 0,
    inputSize: 0,
    inputName: "",
  });

  const loadFFmpeg = useCallback(async () => {
    if (ffmpegRef.current) return ffmpegRef.current;

    const ffmpeg = new FFmpeg();
    
    ffmpeg.on("progress", ({ progress }) => {
      setState((s) => ({ ...s, progress: Math.round(progress * 100) }));
    });

    ffmpeg.on("log", ({ message }) => {
      setState((s) => ({ ...s, log: message }));
    });

    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    });

    ffmpegRef.current = ffmpeg;
    return ffmpeg;
  }, []);

  const compress = useCallback(async (file: File) => {
    setState({
      status: "loading",
      progress: 0,
      log: "Loading FFmpeg...",
      outputUrl: null,
      outputSize: 0,
      inputSize: file.size,
      inputName: file.name,
    });

    try {
      const ffmpeg = await loadFFmpeg();

      setState((s) => ({ ...s, status: "compressing", log: "Writing input file..." }));

      const inputName = "input.mp4";
      const outputName = "output.mp4";

      await ffmpeg.writeFile(inputName, await fetchFile(file));

      const args = [
        "-i", inputName,
        "-c:v", "libx264",
        "-preset", settings.preset,
        "-crf", String(settings.quality),
        "-vf", `scale=${settings.resolution}`,
        "-c:a", "aac",
        "-b:a", settings.audioBitrate,
        "-ac", "2",
        "-movflags", "+faststart",
        "-y", outputName,
      ];

      await ffmpeg.exec(args);

      const data = await ffmpeg.readFile(outputName);
      const uint8 = data as Uint8Array;
      const blob = new Blob([new Uint8Array(uint8)], { type: "video/mp4" });
      const url = URL.createObjectURL(blob);

      setState((s) => ({
        ...s,
        status: "done",
        progress: 100,
        log: "Compression complete!",
        outputUrl: url,
        outputSize: blob.size,
      }));

      // Cleanup input
      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);
    } catch (err: any) {
      setState((s) => ({
        ...s,
        status: "error",
        log: err?.message || "Compression failed",
      }));
    }
  }, [settings, loadFFmpeg]);

  const reset = useCallback(() => {
    if (state.outputUrl) URL.revokeObjectURL(state.outputUrl);
    setState({
      status: "idle",
      progress: 0,
      log: "",
      outputUrl: null,
      outputSize: 0,
      inputSize: 0,
      inputName: "",
    });
  }, [state.outputUrl]);

  return { state, settings, setSettings, compress, reset };
}
