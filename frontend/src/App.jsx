import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Landing from "./screens/Landing";
import ParentLanding from "./screens/ParentLanding";
import ParentRegister from "./screens/ParentRegister";
import ParentLogin from "./screens/ParentLogin";
import ParentHome from "./screens/ParentHome";
import ParentProfile from "./screens/ParentProfile";
import ParentSearch from "./screens/ParentSearch";
import ParentDaycareView from "./screens/ParentDaycareView";
import BookingConfirmation from "./screens/BookingConfirmation";
import ParentBookings from "./screens/ParentBookings";
import DaycareLanding from "./screens/DaycareLanding";
import DaycareRegister from "./screens/DaycareRegister";
import DaycareLogin from "./screens/DaycareLogin";
import ScrollToTop from "./components/ScrollToTop";
import DaycareDashboard from "./screens/DaycareDashboard";
import DaycareProfile from "./screens/DaycareProfile";
import PublicDaycareSearch from "./screens/PublicDaycareSearch";
import PublicDaycareView from "./screens/PublicDaycareView";

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
          <Route path="/parent/home" element={<ParentHome />} />
          <Route path="/parent/profile" element={<ParentProfile />} />
          <Route path="/parent/search" element={<ParentSearch />} />
          <Route path="/parent/daycare/:id" element={<ParentDaycareView />} />
          <Route path="/parent/book/:id" element={<BookingConfirmation />} />
          <Route path="/parent/bookings" element={<ParentBookings />} />
          <Route path="/daycare" element={<DaycareLanding />} />
          <Route path="/daycare/register" element={<DaycareRegister />} />
          <Route path="/daycare/login" element={<DaycareLogin />} />
          <Route path="/daycare/dashboard" element={<DaycareDashboard />} />
          <Route path="/daycare/profile" element={<DaycareProfile />} />
          <Route path="/daycare/search" element={<PublicDaycareSearch />} />
          <Route path="/daycare/view/:id" element={<PublicDaycareView />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;