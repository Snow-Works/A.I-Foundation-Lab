// src/App.jsx
import { HashRouter, Routes, Route } from "react-router-dom";
import RootLayout from "./components/layout/RootLayout.jsx";
import Landing from "./pages/Landing.jsx";
import NotFound from "./pages/NotFound.jsx";
import StyleGuideLayout from "./pages/style-guide/StyleGuideLayout.jsx";
import StyleGuideIndex from "./pages/style-guide/StyleGuideIndex.jsx";
import Foundations from "./pages/style-guide/sections/Foundations.jsx";
import Components from "./pages/style-guide/sections/Components.jsx";
import Patterns from "./pages/style-guide/sections/Patterns.jsx";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<Landing />} />

          <Route path="style-guide" element={<StyleGuideLayout />}>
            <Route index element={<StyleGuideIndex />} />
            <Route path="foundations" element={<Foundations />} />
            <Route path="components" element={<Components />} />
            <Route path="patterns" element={<Patterns />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}