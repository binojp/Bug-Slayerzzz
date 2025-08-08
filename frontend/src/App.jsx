import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Leaderboard from "./Pages/leaderboard"
import Districtmap from "./Pages/Districtmap.jsx"
import Keralamap from "./Pages/Keralamap.jsx"


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/districtmap" element={<Districtmap />} />
        <Route path="/keralamap" element={<Keralamap />} />

      </Routes>
    </BrowserRouter>
  );
}
