import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Heatmap from "./Pages/Heatmap";
import UploadIMG from "./Pages/UploadImg";
import Leaderboard from "./Pages/Leaderboard";
import AdminDashboardPage from "./Pages/Admindashboardpage";  
import Navbar from "./Navbar";
export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/heatmap" element={<Heatmap />} />
        <Route path="/uploadIMG" element={<UploadIMG />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/admindashboardoage" element={<AdminDashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}
