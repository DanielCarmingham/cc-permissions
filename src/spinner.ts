import { Worker } from "node:worker_threads";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { AnalysisResult } from "./types.js";
import { color, colors, useColors } from "./format.js";

const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const SPINNER_INTERVAL_MS = 80;

/**
 * Run analyzeDirectory() in a Worker thread with a progress spinner on stderr.
 *
 * In compiled (production) mode:
 * - TTY: animated braille spinner (cyan) at 80ms intervals
 * - Non-TTY: single static line, no animation
 * - Worker errors/crashes: spinner cleared, promise rejected
 *
 * In dev mode (tsx): Worker threads can't resolve .ts imports through tsx's
 * loader hooks, so we fall back to a direct synchronous call with a static
 * message. The spinner animation isn't possible in this mode since
 * analyzeDirectory() blocks the event loop.
 */
export async function runAnalysisWithSpinner(dir: string): Promise<AnalysisResult> {
  const isTsx = import.meta.url.endsWith(".ts");

  if (isTsx) {
    // Dev mode: tsx loader hooks don't propagate to Worker threads,
    // so import and call analyzeDirectory directly.
    const isTTY = process.stderr.isTTY ?? false;
    const message = "Analyzing project...";
    if (isTTY) {
      const frame = SPINNER_FRAMES[0];
      const coloredFrame = useColors() ? color(frame, colors.cyan) : frame;
      process.stderr.write(`${coloredFrame} ${message}`);
    } else {
      process.stderr.write(`${message}\n`);
    }

    const { analyzeDirectory } = await import("./analyze.js");
    const result = analyzeDirectory(dir);

    if (isTTY) {
      process.stderr.write("\r\x1b[K");
    }

    return result;
  }

  // Production mode: use Worker thread for non-blocking spinner animation
  return runWithWorker(dir);
}

function runWithWorker(dir: string): Promise<AnalysisResult> {
  return new Promise((resolve, reject) => {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const workerPath = join(__dirname, "analyze-worker.js");
    const isTTY = process.stderr.isTTY ?? false;
    const message = "Analyzing project...";

    // Non-TTY fallback: static line, no animation
    if (!isTTY) {
      process.stderr.write(`${message}\n`);
    }

    let frameIndex = 0;
    let spinnerTimer: ReturnType<typeof setInterval> | null = null;

    if (isTTY) {
      spinnerTimer = setInterval(() => {
        const frame = SPINNER_FRAMES[frameIndex % SPINNER_FRAMES.length];
        const coloredFrame = useColors() ? color(frame, colors.cyan) : frame;
        process.stderr.write(`\r\x1b[K${coloredFrame} ${message}`);
        frameIndex++;
      }, SPINNER_INTERVAL_MS);
    }

    function clearSpinner(): void {
      if (spinnerTimer !== null) {
        clearInterval(spinnerTimer);
        spinnerTimer = null;
      }
      if (isTTY) {
        process.stderr.write("\r\x1b[K");
      }
    }

    const worker = new Worker(workerPath, {
      workerData: { dir },
    });

    worker.on("message", (msg: { success: boolean; result?: AnalysisResult; error?: string }) => {
      clearSpinner();
      if (msg.success) {
        resolve(msg.result!);
      } else {
        reject(new Error(msg.error ?? "Analysis failed in worker"));
      }
    });

    worker.on("error", (err) => {
      clearSpinner();
      reject(err);
    });

    worker.on("exit", (code) => {
      clearSpinner();
      if (code !== 0) {
        reject(new Error(`Analysis worker exited with code ${code}`));
      }
    });
  });
}
