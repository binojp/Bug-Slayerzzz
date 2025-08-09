import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Heatmap from "./Pages/Heatmap";
import UploadIMG from "./Pages/Report";
import Leaderboard from "./Pages/Leaderboard";
import AdminDashboardPage from "./Pages/Admindashboardpage";  
import Navbar from "./Navbar";
import UserDash from "./Pages/UserDash";
import AdminDash from "./Pages/AdminDash";
import AddAdmin from "./Pages/AddAdmin";
import HarithaKS from "./Pages/HarithaKS"

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
        <Route path="/user/dashboard" element={<UserDash />} />
        <Route path="/admin/dashboard" element={<AdminDash />} />
        <Route path="/harithaks" element={<HarithaKS />} />
        <Route path="/add" element={<AddAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}
