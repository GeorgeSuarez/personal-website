import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./theme/ThemeProvider";
import AppChrome from "./components/AppChrome";
import Home from "./components/Home";
import NotFound from "./components/NotFound";

export default function App() {
  return (
    <ThemeProvider>
      <AppChrome>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppChrome>
    </ThemeProvider>
  );
}
