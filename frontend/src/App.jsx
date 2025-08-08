import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import UploadIMG from "./Pages/UploadIMG";


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/uploadIMG" element={<UploadIMG />} />

      </Routes>
    </BrowserRouter>
  );

export default App
