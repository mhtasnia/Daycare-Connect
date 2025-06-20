import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Landing from "./screens/Landing";
import ParentLanding from "./screens/ParentLanding";
import ParentRegister from "./screens/ParentRegister";
import ParentLogin from "./screens/ParentLogin";
<<<<<<< HEAD
import ParentHome from "./screens/ParentHome";
import ParentProfile from "./screens/ParentProfile";
=======
import DaycareLanding from "./screens/DaycareLanding";
import DaycareRegister from "./screens/DaycareRegister";
import DaycareLogin from "./screens/DaycareLogin";
import ScrollToTop from "./components/ScrollToTop";
>>>>>>> 7f034523dd7cb1b2d82f3fdbe5ee6cd9c04d6d14

function App() {
  return (
    <div className="full-width-theme">
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/parent" element={<ParentLanding />} />
          <Route path="/parent/register" element={<ParentRegister />} />
          <Route path="/parent/login" element={<ParentLogin />} />
<<<<<<< HEAD
          <Route path="/parent/home" element={<ParentHome />} />
          <Route path="/parent/profile" element={<ParentProfile />} />
=======
          <Route path="/daycare" element={<DaycareLanding />} />
          <Route path="/daycare/register" element={<DaycareRegister />} />
          <Route path="/daycare/login" element={<DaycareLogin />} />
>>>>>>> 7f034523dd7cb1b2d82f3fdbe5ee6cd9c04d6d14
        </Routes>
      </Router>
    </div>
  );
}

export default App;
