import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./theme/ThemeProvider";
import ThemeFab from "./components/ThemeFab";
import Home from "./components/Home";
import NotFound from "./components/NotFound";

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ThemeFab />
    </ThemeProvider>
  );
}
