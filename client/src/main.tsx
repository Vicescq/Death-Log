import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import Home from "./pages/Home.tsx";
import ProfilePage from "./pages/ProfilePage.tsx"
import GameProfiles from "./pages/GameProfiles.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/:nameContext" element={<GameProfiles/>}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
