// src/App.jsx
import { lazy, Suspense } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { AdminAuthProvider } from "./context/AdminAuthContext.jsx";
import RootLayout from "./components/layout/RootLayout.jsx";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import Landing from "./pages/Landing.jsx";
import Register from "./pages/Register.jsx";
import VerifyPending from "./pages/VerifyPending.jsx";
import AuthVerified from "./pages/AuthVerified.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import PhotoUpload from "./pages/PhotoUpload.jsx";
import ExamGate from "./pages/ExamGate.jsx";
import ExamIntro from "./pages/ExamIntro.jsx";
import ExamSession from "./pages/ExamSession.jsx";
import ExamSubmitted from "./pages/ExamSubmitted.jsx";

// Admin Imports
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminRoster from "./pages/admin/AdminRoster.jsx";
import AdminSettings from "./pages/admin/AdminSettings.jsx";
import AdminQuestions from "./pages/admin/AdminQuestions.jsx";
import AdminSubmissions from "./pages/admin/AdminSubmissions.jsx"; // Added
import AdminMarking from "./pages/admin/AdminMarking.jsx"; // Added

import NotFound from "./pages/NotFound.jsx";

const StyleGuideLayout = lazy(() => import("./pages/style-guide/StyleGuideLayout.jsx"));
const StyleGuideIndex = lazy(() => import("./pages/style-guide/StyleGuideIndex.jsx"));
const Foundations = lazy(() => import("./pages/style-guide/sections/Foundations.jsx"));
const Components = lazy(() => import("./pages/style-guide/sections/Components.jsx"));
const Patterns = lazy(() => import("./pages/style-guide/sections/Patterns.jsx"));

function RouteFallback() {
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: "var(--fs-sm)" }}>
      Loading…
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <HashRouter>
          <Routes>
            {/* --- Admin Routes --- */}
            <Route path="admin/login" element={<AdminLogin />} />
            <Route
              path="admin"
              element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="roster" element={<AdminRoster />} />
              
              {/* Updated Submissions Routes */}
              <Route path="submissions" element={<AdminSubmissions />} />
              <Route path="submissions/:attemptId" element={<AdminMarking />} />
              
              <Route path="questions" element={<AdminQuestions />} />
              <Route path="violations" element={<div className="admin-placeholder">Violations coming soon</div>} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* --- Student Routes --- */}
            <Route element={<RootLayout />}>
              <Route index element={<Landing />} />
              <Route path="register" element={<Register />} />
              <Route path="verify-pending" element={<VerifyPending />} />
              <Route path="auth/verified" element={<AuthVerified />} />
              <Route path="login" element={<Login />} />
              <Route path="exam-gate" element={<ExamGate />} />

              <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="profile/photo" element={<ProtectedRoute><PhotoUpload /></ProtectedRoute>} />
              <Route path="exam/intro" element={<ProtectedRoute><ExamIntro /></ProtectedRoute>} />
              <Route path="exam/session/:attemptId" element={<ProtectedRoute><ExamSession /></ProtectedRoute>} />
              <Route path="exam/submitted" element={<ProtectedRoute><ExamSubmitted /></ProtectedRoute>} />

              <Route path="style-guide" element={<Suspense fallback={<RouteFallback />}><StyleGuideLayout /></Suspense>}>
                <Route index element={<Suspense fallback={<RouteFallback />}><StyleGuideIndex /></Suspense>} />
                <Route path="foundations" element={<Suspense fallback={<RouteFallback />}><Foundations /></Suspense>} />
                <Route path="components" element={<Suspense fallback={<RouteFallback />}><Components /></Suspense>} />
                <Route path="patterns" element={<Suspense fallback={<RouteFallback />}><Patterns /></Suspense>} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </HashRouter>
      </AdminAuthProvider>
    </AuthProvider>
  );
}