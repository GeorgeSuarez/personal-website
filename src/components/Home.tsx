import { useState } from "react";
import Hero from "./Hero";
// import LoadingScreen from "./LoadingScreen";

export default function Home() {
  const [loadingComplete] = useState(true);

  return (
    <>
      {/* {!loadingComplete && (
        <LoadingScreen onComplete={() => setLoadingComplete(true)} />
      )} */}
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
