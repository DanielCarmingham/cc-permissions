import { parentPort, workerData } from "node:worker_threads";
import { analyzeDirectory } from "./analyze.js";

const { dir } = workerData as { dir: string };

try {
  const result = analyzeDirectory(dir);
  parentPort!.postMessage({ success: true, result });
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  parentPort!.postMessage({ success: false, error: message });
}
