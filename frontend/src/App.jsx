import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Landing from "./screens/Landing";
import ParentLanding from "./screens/ParentLanding";
import ParentRegister from "./screens/ParentRegister";
import ParentLogin from "./screens/ParentLogin";
import DaycareLanding from "./screens/DaycareLanding";
import DaycareRegister from "./screens/DaycareRegister";
import DaycareLogin from "./screens/DaycareLogin";
import ScrollToTop from "./components/ScrollToTop";
import DaycareDashboard from "./screens/DaycareDashboard";

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
          <Route path="/daycare" element={<DaycareLanding />} />
          <Route path="/daycare/register" element={<DaycareRegister />} />
          <Route path="/daycare/login" element={<DaycareLogin />} />
          <Route path="/daycare/dashboard" element={<DaycareDashboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
