// src/context/AuthContext.jsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import pb from "../lib/pocketbase";

/* ------------------------------------------------------------
   Canonical profile status list (mirrors the migrations).
   Consumers import this to avoid typos and to iterate status
   values in dropdowns/filters.
   ------------------------------------------------------------ */
export const PROFILE_STATUSES = [
  "REGISTERED",
  "EMAIL_VERIFIED",
  "APPROVED",
  "PHOTO_VERIFIED",
  "COMMUNITY_UNLOCKED",
  "IDENTITY_CONFIRMED",
  "EXAM_IN_PROGRESS",
  "SUBMITTED",
  "MARKED",
  "REJECTED",
];

/* ------------------------------------------------------------
   getDisplayStatus — normalizes stored status for UI display.
   PHOTO_VERIFIED is displayed as COMMUNITY_UNLOCKED so the
   ProgressTracker shows the "Community" step as the student's
   current position (they've already completed photo verification).
   The underlying stored status is not changed.
   ------------------------------------------------------------ */
export function getDisplayStatus(status) {
  if (status === "PHOTO_VERIFIED") return "COMMUNITY_UNLOCKED";
  return status;
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // `user` is the PocketBase auth record (profile) or null.
  const [user, setUser] = useState(() =>
    pb.authStore.isValid ? pb.authStore.model : null
  );
  const [loading, setLoading] = useState(true);

  /* ---------------------------------------------
     Subscribe to PocketBase's auth store.
     Every login/logout/refresh fires this listener.
     --------------------------------------------- */
  useEffect(() => {
    const unsubscribe = pb.authStore.onChange((_token, model) => {
      console.log("[auth] store changed:", model?.email || "logged out");
      setUser(model || null);
    });

    // Bootstrap done — we've read pb.authStore synchronously
    setLoading(false);

    return () => unsubscribe();
  }, []);

  /* ---------------------------------------------
     Logout — clears PocketBase's auth store.
     The listener above will update `user` to null.
     --------------------------------------------- */
  const logout = useCallback(() => {
    pb.authStore.clear();
  }, []);

  /* ---------------------------------------------
     Refresh — re-validates the current session.
     Only clears the store on real auth failures (401/403).
     Transient errors (rate limit, network) leave the session intact.
     --------------------------------------------- */
  const refresh = useCallback(async () => {
    if (!pb.authStore.isValid) {
      setUser(null);
      return null;
    }
    try {
      const auth = await pb.collection("profiles").authRefresh();
      setUser(auth.model);
      return auth.model;
    } catch (err) {
      const status = err?.status || err?.response?.code;
      // Only nuke the session if the server explicitly says we're not auth'd
      if (status === 401 || status === 403) {
        pb.authStore.clear();
        setUser(null);
        return null;
      }
      // Transient error (rate limit, server hiccup, network) — keep the session
      return pb.authStore.model;
    }
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    logout,
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* ---------------------------------------------
   useAuth — the hook components call.
   --------------------------------------------- */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}