// src/lib/faceDetector.js
import { FaceDetector, FilesetResolver } from "@mediapipe/tasks-vision";

/* ------------------------------------------------------------
   MediaPipe assets are loaded from public CDNs at runtime.
   They are NOT bundled into the app — keeps our JS bundle small.
   ------------------------------------------------------------ */

const MP_VERSION = "0.10.14"; // ← if npm installed a newer version, update this
const WASM_PATH = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VERSION}/wasm`;
const MODEL_PATH =
  "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite";

let detectorPromise = null;

/**
 * Lazily create and cache the detector.
 * The first call downloads ~5 MB of WASM + model.
 * Subsequent calls reuse the same instance.
 */
async function getDetector() {
  if (detectorPromise) return detectorPromise;

  detectorPromise = (async () => {
    console.log("[faceDetector] initialising MediaPipe…");
    const vision = await FilesetResolver.forVisionTasks(WASM_PATH);

    // Try GPU first, fall back to CPU
    try {
      const detector = await FaceDetector.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: MODEL_PATH,
          delegate: "GPU",
        },
        runningMode: "IMAGE",
      });
      console.log("[faceDetector] ready (GPU)");
      return detector;
    } catch (gpuErr) {
      console.warn("[faceDetector] GPU init failed, using CPU:", gpuErr);
      const detector = await FaceDetector.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: MODEL_PATH,
          delegate: "CPU",
        },
        runningMode: "IMAGE",
      });
      console.log("[faceDetector] ready (CPU)");
      return detector;
    }
  })();

  return detectorPromise;
}

/**
 * Load a File/Blob into an HTMLImageElement ready for detection.
 */
function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read the image file."));
    };
    img.src = url;
  });
}

/**
 * Run face detection on an image File/Blob.
 *
 * @returns {Promise<{ count: number, detections: Array, image: HTMLImageElement }>}
 */
export async function detectFacesInFile(file) {
  const image = await loadImage(file);
  const detector = await getDetector();

  const result = detector.detect(image);
  const detections = result?.detections || [];

  return {
    count: detections.length,
    detections,
    image,
  };
}