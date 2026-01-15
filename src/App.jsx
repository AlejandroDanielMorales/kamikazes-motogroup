import { Routes, Route } from "react-router-dom";
import Navbar from "./assets/components/Navbar/Navbar.jsx";
import Home from "./assets/pages/Home/Home.jsx";
import Login from "./assets/pages/Login/Login.jsx";
import Register from "./assets/pages/Register/Register.jsx";
import StopsMap from "./assets/components/StopsMap/StopsMap.jsx";
import Events from "./assets/pages/Events/Events.jsx";
import EventAdmin from "./assets/pages/EventAdmin/EventAdmin.jsx";



function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<StopsMap />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events" element={<Events />} />

        <Route path="/admin/event" element={<EventAdmin />} />

      </Routes>
    </>
  );
}

export default App;
