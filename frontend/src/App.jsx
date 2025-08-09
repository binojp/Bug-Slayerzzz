import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Heatmap from "./Pages/Heatmap";
import Report from "./Pages/Report";
import Leaderboard from "./Pages/Leaderboard";
import Navbar from "./Navbar";
import UserDash from "./Pages/UserDash";
import AdminDash from "./Pages/AdminDash";
import AddAdmin from "./Pages/AddAdmin";
import ReportDetails from "./Pages/ReportDetails.jsx"
import UserReportDetails from "./Pages/UserReportDetails.jsx";
import RewardsPage from "./Pages/Rewards.jsx";
export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/heatmap" element={<Heatmap />} />
        <Route path="/report" element={<Report />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/user/dashboard" element={<UserDash />} />
        <Route path="/admin/dashboard" element={<AdminDash />} />
        <Route path="/add" element={<AddAdmin />} />
        <Route path="/admin/dashboard" element={<AdminDash />} />
        <Route path="/admin/report/:id" element={<ReportDetails />} />
        <Route path="/user/report/:id" element={<UserReportDetails />} />
        <Route path="/rewards" element={<RewardsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
