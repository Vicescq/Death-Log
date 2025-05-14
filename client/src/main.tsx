import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import Home from "./pages/Home.tsx";
import GameProfiles from "./pages/GameProfiles.tsx";
import { GamesContextWrapper } from "./context.tsx";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <GamesContextWrapper children={<AppRoutes/>}/>
    </BrowserRouter>
  </StrictMode>
);

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:nameContext" element={<GameProfiles />} />
    </Routes>
  )
}