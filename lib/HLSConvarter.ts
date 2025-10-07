import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";

export class HLSConverter {
    private static instance: HLSConverter;
    private constructor() {
        ffmpeg.setFfmpegPath("/usr/bin/ffmpeg")
    }

    public static getInstance(): HLSConverter {
        if (!HLSConverter.instance) {
            HLSConverter.instance = new HLSConverter();
        }
        return HLSConverter.instance;
    }

    async convertToHLS(inputFile: string, outputDir: string) {
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

        const resolutions = [
            { name: "360p", width: 640, height: 360, videoBitrate: "600k", audioBitrate: "128k" },
            { name: "720p", width: 1280, height: 720, videoBitrate: "1200k", audioBitrate: "128k" },
            { name: "1080p", width: 1920, height: 1080, videoBitrate: "3000k", audioBitrate: "192k" },
        ];

        for (const res of resolutions) {
            const playlist = path.join(outputDir, `${res.name}.m3u8`);
            const segmentPattern = path.join(outputDir, `${res.name}_%03d.ts`);

            await new Promise<void>((resolve, reject) => {
                ffmpeg(inputFile)
                    .videoCodec("libx264")
                    .audioCodec("aac")
                    .size(`${res.width}x${res.height}`)
                    .videoBitrate(res.videoBitrate)
                    .audioBitrate(res.audioBitrate)
                    .addOptions([
                        "-profile:v main",
                        "-hls_time 6",
                        "-hls_list_size 0",
                        "-hls_segment_filename", segmentPattern,
                    ])
                    .output(playlist)
                    .on("start", (cmd) => console.log(`🔧 ffmpeg HLS started for ${res.name}:`, cmd))
                    .on("end", () => resolve())
                    .on("error", (err) => reject(err))
                    .run();
            });
        }

        const masterPath = path.join(outputDir, "master.m3u8");
        const masterContent = [
            "#EXTM3U",
            `#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360\n360p.m3u8`,
            `#EXT-X-STREAM-INF:BANDWIDTH=1500000,RESOLUTION=1280x720\n720p.m3u8`,
            `#EXT-X-STREAM-INF:BANDWIDTH=3500000,RESOLUTION=1920x1080\n1080p.m3u8`,
        ].join("\n");

        fs.writeFileSync(masterPath, masterContent);

        return masterPath;
    }
    async extractAudio(inputFile: string, outputDir: string, format: "mp3" | "wav" = "mp3") {
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
        const audioFile = path.join(outputDir, `audio.${format}`);

        return new Promise<string>((resolve, reject) => {
            ffmpeg(inputFile)
                .noVideo()
                .audioCodec("libmp3lame")
                .format(format)
                .on("start", cmd => console.log("ffmpeg audio started:", cmd))
                .on("end", () => resolve(audioFile))
                .on("error", err => reject(err))
                .save(audioFile);
        });
    }
}
