import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./comps/home";
import Navbar from "./comps/navbar";
import Profile from "./comps/profile";
import MyTasks from "./comps/mytasks";
import Auth from "./comps/auth";
import Payments from "./comps/payments";
import ProtectedRoute from "./comps/protectedroute";
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
            </ProtectedRoute>
            } />
        <Route path="/mytasks"  element={<ProtectedRoute><MyTasks /></ProtectedRoute>} />
        <Route path="/auth" element={<Auth />} />
        <Route path="Payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;
