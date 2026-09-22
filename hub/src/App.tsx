import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import AppView from "./pages/AppView";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/app/:slug" element={<AppView />} />
    </Routes>
  );
}
