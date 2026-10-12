// src/App.jsx
import { lazy, Suspense } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import RootLayout from "./components/layout/RootLayout.jsx";
import Landing from "./pages/Landing.jsx";
import Register from "./pages/Register.jsx";
import VerifyPending from "./pages/VerifyPending.jsx";
import NotFound from "./pages/NotFound.jsx";
import AuthVerified from "./pages/AuthVerified.jsx";
import Login from "./pages/Login.jsx";

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
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-muted)",
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
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route element={<RootLayout />}>
            <Route index element={<Landing />} />
            <Route path="register" element={<Register />} />
            <Route path="verify-pending" element={<VerifyPending />} />

            <Route path="auth/verified" element={<AuthVerified />} />
            <Route path="login" element={<Login />} />

            <Route
              path="style-guide"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <StyleGuideLayout />
                </Suspense>
              }
            >
              <Route
                index
                element={
                  <Suspense fallback={<RouteFallback />}>
                    <StyleGuideIndex />
                  </Suspense>
                }
              />
              <Route
                path="foundations"
                element={
                  <Suspense fallback={<RouteFallback />}>
                    <Foundations />
                  </Suspense>
                }
              />
              <Route
                path="components"
                element={
                  <Suspense fallback={<RouteFallback />}>
                    <Components />
                  </Suspense>
                }
              />
              <Route
                path="patterns"
                element={
                  <Suspense fallback={<RouteFallback />}>
                    <Patterns />
                  </Suspense>
                }
              />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}