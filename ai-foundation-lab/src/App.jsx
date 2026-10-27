// src/App.jsx
import { lazy, Suspense } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { AdminAuthProvider } from "./context/AdminAuthContext.jsx";
import ErrorBoundary from "./components/ui/ErrorBoundary.jsx";
import RootLayout from "./components/layout/RootLayout.jsx";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";

// --- Eagerly loaded (Core pages) ---
import Landing from "./pages/Landing.jsx";
import Register from "./pages/Register.jsx";
import VerifyPending from "./pages/VerifyPending.jsx";
import AuthVerified from "./pages/AuthVerified.jsx";
import Login from "./pages/Login.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Profile from "./pages/Profile.jsx";
import NotFound from "./pages/NotFound.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";

// --- Lazy Loaded (Heavy / Secondary pages) ---
const PhotoUpload = lazy(() => import("./pages/PhotoUpload.jsx"));
const ExamGate = lazy(() => import("./pages/ExamGate.jsx"));
const ExamIntro = lazy(() => import("./pages/ExamIntro.jsx"));
const ExamSession = lazy(() => import("./pages/ExamSession.jsx"));
const ExamSubmitted = lazy(() => import("./pages/ExamSubmitted.jsx"));

// --- Lazy Loaded Admin Pages ---
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout.jsx"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.jsx"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers.jsx"));
const AdminRoster = lazy(() => import("./pages/admin/AdminRoster.jsx"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings.jsx"));
const AdminQuestions = lazy(() => import("./pages/admin/AdminQuestions.jsx"));
const AdminSubmissions = lazy(() =>
  import("./pages/admin/AdminSubmissions.jsx")
);
const AdminMarking = lazy(() => import("./pages/admin/AdminMarking.jsx"));
const AdminViolations = lazy(() =>
  import("./pages/admin/AdminViolations.jsx")
);
const AdminAudit = lazy(() => import("./pages/admin/AdminAudit.jsx"));
const AdminResults = lazy(() => import("./pages/admin/AdminResults.jsx"));
const AdminResultDetail = lazy(() =>
  import("./pages/admin/AdminResultDetail.jsx")
);
const AdminGate = lazy(() => import("./pages/admin/AdminGate.jsx"));

// --- Lazy Loaded Style Guide ---
const StyleGuideLayout = lazy(() =>
  import("./pages/style-guide/StyleGuideLayout.jsx")
);
const StyleGuideIndex = lazy(() =>
  import("./pages/style-guide/StyleGuideIndex.jsx")
);
const Foundations = lazy(() =>
  import("./pages/style-guide/sections/Foundations.jsx")
);
const Components = lazy(() =>
  import("./pages/style-guide/sections/Components.jsx")
);
const Patterns = lazy(() =>
  import("./pages/style-guide/sections/Patterns.jsx")
);

function RouteFallback() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--ink-950)",
        color: "var(--cyan-400)",
        fontFamily: "var(--font-body)",
        fontSize: "var(--fs-sm)",
      }}
    >
      Loading…
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AdminAuthProvider>
          <HashRouter>
            <Suspense fallback={<RouteFallback />}>
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
                  <Route path="submissions" element={<AdminSubmissions />} />
                  <Route
                    path="submissions/:attemptId"
                    element={<AdminMarking />}
                  />
                  <Route path="results" element={<AdminResults />} />
                  <Route
                    path="results/:attemptId"
                    element={<AdminResultDetail />}
                  />
                  <Route path="gate" element={<AdminGate />} />
                  <Route path="questions" element={<AdminQuestions />} />
                  <Route path="violations" element={<AdminViolations />} />
                  <Route path="audit" element={<AdminAudit />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* --- Student Routes --- */}
                <Route element={<RootLayout />}>
                  <Route index element={<Landing />} />
                  <Route path="register" element={<Register />} />
                  <Route path="verify-pending" element={<VerifyPending />} />
                  <Route path="auth/verified" element={<AuthVerified />} />
                  <Route path="login" element={<Login />} />
                  <Route
                    path="forgot-password"
                    element={<ForgotPassword />}
                  />
                  <Route path="reset-password" element={<ResetPassword />} />
                  <Route path="exam-gate" element={<ExamGate />} />

                  <Route
                    path="profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="profile/photo"
                    element={
                      <ProtectedRoute>
                        <PhotoUpload />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="exam/intro"
                    element={
                      <ProtectedRoute>
                        <ExamIntro />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="exam/session/:attemptId"
                    element={
                      <ProtectedRoute>
                        <ExamSession />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="exam/submitted"
                    element={
                      <ProtectedRoute>
                        <ExamSubmitted />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="style-guide" element={<StyleGuideLayout />}>
                    <Route index element={<StyleGuideIndex />} />
                    <Route path="foundations" element={<Foundations />} />
                    <Route path="components" element={<Components />} />
                    <Route path="patterns" element={<Patterns />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Suspense>
          </HashRouter>
        </AdminAuthProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}