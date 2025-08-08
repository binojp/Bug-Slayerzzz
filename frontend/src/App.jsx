import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Heatmap from "./Pages/Heatmap"
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
                <Route path="/heatmap" element={<Heatmap />} />


      </Routes>
    </BrowserRouter>
  );
}
