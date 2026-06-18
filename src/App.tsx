import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import LoadingScreen from "./components/LoadingScreen";
import Hero from "./components/Hero";
import NotFound from "./components/NotFound";

function Home() {
  const [loadingComplete, setLoadingComplete] = useState(false);

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
        <Hero />
      </div>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
