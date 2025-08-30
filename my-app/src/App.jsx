// src/App.jsx
import "./App.css";
import Navbar from "./components/navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import QrCodeManagerPage from "./pages/QrCodeManagerPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Default route (homepage) */}
        <Route path="/" element={<Home />} />
        <Route path="/qr-manager" element={<QrCodeManagerPage />} />
      </Routes>
    </Router>
  );
}

export default App;
