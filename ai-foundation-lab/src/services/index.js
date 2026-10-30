// src/services/index.js
//
// Re-exports the public service modules so consumers can import
// from a single path:
//
//     import { authService } from "../services";
//
// Keep this file import-free. A previous version imported from
// itself and created a circular dependency at module-init time.

export * as authService from "./authService.js";
export * as profileService from "./profileService.js";
export * as settingsService from "./settingsService.js";