// src/context/AdminAuthContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import pbAdmin from "../lib/pocketbaseAdmin";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(() =>
    pbAdmin.authStore.isValid ? pbAdmin.authStore.model : null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = pbAdmin.authStore.onChange((_token, model) => {
      console.log("[admin-auth] store changed:", model?.email || "logged out");
      setAdmin(model || null);
    });

    setLoading(false);
    return () => unsubscribe();
  }, []);

  const logout = useCallback(() => {
    pbAdmin.authStore.clear();
  }, []);

  const value = {
    admin,
    loading,
    isAuthenticated: !!admin,
    logout,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used inside <AdminAuthProvider>");
  }
  return ctx;
}