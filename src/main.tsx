import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import KeyboardSettings from "./pages/settings/KeyboardSettings.tsx";
import FAQ from "./pages/FAQ.tsx";
import ActionSettings from "./pages/settings/ActionsSettings.tsx";
import IndexSettings from "./pages/settings/IndexSettings.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/FAQ" element={<FAQ />} />
        <Route path="/settings/">
          <Route index element={<IndexSettings />} />
          <Route path="actions" element={<ActionSettings />} />
          <Route path="layouts" element={<KeyboardSettings />} />
          <Route path="*" element={<IndexSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
