// src/lib/pocketbaseAdmin.js
import PocketBase, { LocalAuthStore } from "pocketbase";

const PB_URL = import.meta.env.VITE_POCKETBASE_URL || "http://127.0.0.1:8090";

// Use a distinct auth store key so admin sessions don't collide with student sessions
const adminStore = new LocalAuthStore("pb_admin_auth");

const pbAdmin = new PocketBase(PB_URL, adminStore);
pbAdmin.autoCancellation(false);

export default pbAdmin;