import { createClient } from "@sanity/client";
import { execFileSync } from "child_process";
import { mkdtempSync, writeFileSync, renameSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import "dotenv/config";

// Builds public/hero-reel.mp4 — a muted montage made of a short clip from
// every project's preview video. Re-run after adding/removing/replacing a
// project's preview video. Requires ffmpeg/ffprobe on PATH.

const CLIP_DURATION = 2.5; // seconds per project clip
const START_OFFSET = 1.0; // seconds skipped from the start of each source video
const OUTPUT_WIDTH = 1920;
const OUTPUT_HEIGHT = 1080;
const OUTPUT_FPS = 30;
const OUTPUT_CRF = 20;
const OUTPUT_PRESET = "medium";
const OUTPUT_PATH = "public/hero-reel.mp4";
const MIN_CLIP_DURATION = 0.5; // skip a source if there isn't even this much usable footage

const client = createClient({
	projectId: process.env.VITE_SANITY_PROJECT_ID,
	dataset: process.env.VITE_SANITY_DATASET || "production",
	apiVersion: process.env.VITE_SANITY_API_VERSION || "2024-01-01",
	useCdn: false,
});

function probeDuration(filePath) {
	const out = execFileSync("ffprobe", [
		"-v", "error",
		"-show_entries", "format=duration",
		"-of", "default=noprint_wrappers=1:nokey=1",
		filePath,
	]).toString().trim();
	const duration = parseFloat(out);
	if (!Number.isFinite(duration)) throw new Error(`could not parse duration ("${out}")`);
	return duration;
}

async function downloadToFile(url, destPath) {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`fetch failed: ${res.status} ${res.statusText}`);
	const buffer = Buffer.from(await res.arrayBuffer());
	writeFileSync(destPath, buffer);
}

async function generate() {
	const works = await client.fetch(
		`*[_type == "work" && defined(video.asset)] | order(orderRank asc) {
			_id, title, projectId, "videoUrl": video.asset->url
		}`
	);

	if (works.length === 0) {
		console.error("No projects with a preview video found — nothing to generate.");
		process.exitCode = 1;
		return;
	}

	const tmpDir = mkdtempSync(join(tmpdir(), "hero-reel-"));
	const usableClips = [];

	try {
		for (let i = 0; i < works.length; i++) {
			const w = works[i];
			const label = w.title || w.projectId || w._id;
			const srcPath = join(tmpDir, `${i}-${w.projectId || w._id}.mp4`);

			try {
				await downloadToFile(w.videoUrl, srcPath);
				const duration = probeDuration(srcPath);

				const start = duration >= START_OFFSET + MIN_CLIP_DURATION ? START_OFFSET : 0;
				const clipDuration = Math.min(CLIP_DURATION, duration - start);

				if (clipDuration < MIN_CLIP_DURATION) {
					console.warn(`⚠ skipping ${label}: source too short (${duration.toFixed(2)}s)`);
					continue;
				}

				usableClips.push({ path: srcPath, start, clipDuration, label });
				console.log(`✓ ${label} (${clipDuration.toFixed(2)}s from ${start.toFixed(2)}s)`);
			} catch (err) {
				console.warn(`⚠ skipping ${label}: ${err.message}`);
			}
		}

		if (usableClips.length === 0) {
			console.error("No usable clips — leaving existing hero-reel.mp4 untouched.");
			process.exitCode = 1;
			return;
		}

		const filterLines = usableClips.map(
			(c, i) =>
				`[${i}:v]trim=start=${c.start}:duration=${c.clipDuration},setpts=PTS-STARTPTS,` +
				`scale=${OUTPUT_WIDTH}:${OUTPUT_HEIGHT}:force_original_aspect_ratio=increase,` +
				`crop=${OUTPUT_WIDTH}:${OUTPUT_HEIGHT},fps=${OUTPUT_FPS},setsar=1,format=yuv420p[v${i}];`
		);
		const concatLine = `${usableClips.map((_, i) => `[v${i}]`).join("")}concat=n=${usableClips.length}:v=1:a=0[outv]`;
		const filterGraphPath = join(tmpDir, "filtergraph.txt");
		writeFileSync(filterGraphPath, [...filterLines, concatLine].join("\n"));

		const tmpOutputPath = join(tmpDir, "hero-reel.tmp.mp4");
		const ffmpegArgs = [
			"-y",
			...usableClips.flatMap((c) => ["-i", c.path]),
			"-/filter_complex", filterGraphPath,
			"-map", "[outv]",
			"-an",
			"-r", String(OUTPUT_FPS),
			"-c:v", "libx264",
			"-preset", OUTPUT_PRESET,
			"-crf", String(OUTPUT_CRF),
			"-pix_fmt", "yuv420p",
			"-movflags", "+faststart",
			tmpOutputPath,
		];
		execFileSync("ffmpeg", ffmpegArgs, { stdio: "inherit" });

		renameSync(tmpOutputPath, OUTPUT_PATH);
		const totalDuration = usableClips.reduce((sum, c) => sum + c.clipDuration, 0);
		console.log(
			`Generated ${OUTPUT_PATH} from ${usableClips.length}/${works.length} projects ` +
			`(${totalDuration.toFixed(1)}s total, ${OUTPUT_WIDTH}x${OUTPUT_HEIGHT}@${OUTPUT_FPS}fps, no audio)`
		);
	} finally {
		rmSync(tmpDir, { recursive: true, force: true });
	}
}

generate().catch((err) => {
	console.error("Failed to generate hero reel:", err);
	process.exitCode = 1;
});
