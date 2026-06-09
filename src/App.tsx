import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingScreen from "./components/LoadingScreen";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import NotFound from "./components/NotFound";
import Resume from "./components/Resume";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  const isHome = window.location.pathname === "/";
  const [loadingComplete, setLoadingComplete] = useState(!isHome);

  return (
    <>
      {!loadingComplete && (
        <LoadingScreen onComplete={() => setLoadingComplete(true)} />
      )}
      <div
        className={`transition-opacity duration-500 ${
          loadingComplete ? "opacity-100" : "opacity-0"
        }`}
      >
        <AppRouter />
      </div>
    </>
  );
}
