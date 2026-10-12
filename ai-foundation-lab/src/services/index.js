// src/services/index.js
export * as authService from "./authService.js";
export * as profileService from "./profileService.js";
export * as settingsService from "./settingsService.js";

import { authService, settingsService } from "../services";
const user = authService.getCurrentUser();