import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Landing from "./screens/Landing";
import ParentLanding from "./screens/ParentLanding";
import ParentRegister from "./screens/ParentRegister";
import ParentLogin from "./screens/ParentLogin";
import ParentHome from "./screens/ParentHome";
import ParentProfile from "./screens/ParentProfile";

function App() {
  return (
    <div className="full-width-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/parent" element={<ParentLanding />} />
          <Route path="/parent/register" element={<ParentRegister />} />
          <Route path="/parent/login" element={<ParentLogin />} />
          <Route path="/parent/home" element={<ParentHome />} />
          <Route path="/parent/profile" element={<ParentProfile />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
