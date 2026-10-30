// src/lib/pocketbase.js
import PocketBase from "pocketbase";

const PB_URL = import.meta.env.VITE_POCKETBASE_URL || "http://127.0.0.1:8090";

/**
 * Single PocketBase client instance, shared app-wide.
 *
 * The SDK stores auth state in localStorage under `pocketbase_auth`
 * and automatically attaches the token to every request.
 */
const pb = new PocketBase(PB_URL);

// Disable automatic cancellation — PocketBase's default "auto-cancel"
// behavior cancels in-flight requests when a new one is made, which
// causes real headaches during rapid writes (autosave during the exam,
// for example). We'll manage cancellation explicitly where it matters.
pb.autoCancellation(false);

export default pb;
export { PB_URL };