import { useState } from "react";
import LoadingScreen from "./components/LoadingScreen";
import Hero from "./components/Hero";

export default function App() {
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
