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
import Leaderboard from "./pages/Leaderboard.jsx";
import NotFound from "./pages/NotFound.jsx";

// --- Informational Pages ---
import About from "./pages/About.jsx";
import Team from "./pages/Team.jsx";
import Legal from "./pages/Legal.jsx";
import Contact from "./pages/Contact.jsx";
import FAQ from "./pages/FAQ.jsx";
import Support from "./pages/Support.jsx";

// --- Manual Pages ---
import ManualLayout from "./pages/manual/ManualLayout.jsx";
import Welcome from "./pages/manual/Welcome.jsx";
import StudentJourney from "./pages/manual/StudentJourney.jsx";
import ExamEnvironment from "./pages/manual/ExamEnvironment.jsx";
import RulesProctoring from "./pages/manual/RulesProctoring.jsx";
import EmergencyProtocol from "./pages/manual/EmergencyProtocol.jsx";

// --- Admin Login (Capital A in 'Admin') ---
import AdminLogin from "./pages/Admin/AdminLogin.jsx";

// --- Lazy Loaded (Heavy / Secondary pages) ---
const PhotoUpload = lazy(() => import("./pages/PhotoUpload.jsx"));
const ExamGate = lazy(() => import("./pages/ExamGate.jsx"));
const ExamIntro = lazy(() => import("./pages/ExamIntro.jsx"));
const ExamSession = lazy(() => import("./pages/ExamSession.jsx"));
const ExamSubmitted = lazy(() => import("./pages/ExamSubmitted.jsx"));

// --- Lazy Loaded Admin Pages (Capital A in 'Admin') ---
const AdminLayout = lazy(() => import("./pages/Admin/AdminLayout.jsx"));
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard.jsx"));
const AdminUsers = lazy(() => import("./pages/Admin/AdminUsers.jsx"));
const AdminRoster = lazy(() => import("./pages/Admin/AdminRoster.jsx"));
const AdminSettings = lazy(() => import("./pages/Admin/AdminSettings.jsx"));
const AdminQuestions = lazy(() => import("./pages/Admin/AdminQuestions.jsx"));
const AdminSubmissions = lazy(() => import("./pages/Admin/AdminSubmissions.jsx"));
const AdminMarking = lazy(() => import("./pages/Admin/AdminMarking.jsx"));
const AdminViolations = lazy(() => import("./pages/Admin/AdminViolations.jsx"));
const AdminAudit = lazy(() => import("./pages/Admin/AdminAudit.jsx"));
const AdminResults = lazy(() => import("./pages/Admin/AdminResults.jsx"));
const AdminResultDetail = lazy(() => import("./pages/Admin/AdminResultDetail.jsx"));
const AdminGate = lazy(() => import("./pages/Admin/AdminGate.jsx"));
const AdminStatus = lazy(() => import("./pages/Admin/AdminStatus.jsx"));
const AdminSupport = lazy(() => import("./pages/Admin/AdminSupport.jsx"));

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
                  <Route path="submissions/:attemptId" element={<AdminMarking />} />
                  <Route path="results" element={<AdminResults />} />
                  <Route path="results/:attemptId" element={<AdminResultDetail />} />
                  <Route path="gate" element={<AdminGate />} />
                  <Route path="questions" element={<AdminQuestions />} />
                  <Route path="violations" element={<AdminViolations />} />
                  <Route path="audit" element={<AdminAudit />} />
                  <Route path="status" element={<AdminStatus />} />
                  <Route path="support" element={<AdminSupport />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* --- Student Routes --- */}
                <Route element={<RootLayout />}>
                  <Route index element={<Landing />} />
                  <Route path="register" element={<Register />} />
                  <Route path="verify-pending" element={<VerifyPending />} />
                  <Route path="auth/verified" element={<AuthVerified />} />
                  <Route path="login" element={<Login />} />
                  <Route path="forgot-password" element={<ForgotPassword />} />
                  <Route path="reset-password" element={<ResetPassword />} />
                  <Route path="exam-gate" element={<ExamGate />} />

                  {/* --- Informational Pages --- */}
                  <Route path="about" element={<About />} />
                  <Route path="team" element={<Team />} />
                  <Route path="legal" element={<Legal />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="faq" element={<FAQ />} />

                  <Route
                    path="profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="support"
                    element={
                      <ProtectedRoute>
                        <Support />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="leaderboard"
                    element={
                      <ProtectedRoute>
                        <Leaderboard />
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

                  {/* --- LAB MANUAL --- */}
                  <Route path="manual" element={<ManualLayout />}>
                    <Route index element={<Welcome />} />
                    <Route path="student-journey" element={<StudentJourney />} />
                    <Route path="exam-environment" element={<ExamEnvironment />} />
                    <Route path="rules-proctoring" element={<RulesProctoring />} />
                    <Route path="emergency" element={<EmergencyProtocol />} />
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