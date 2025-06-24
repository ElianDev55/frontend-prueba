import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Bills } from "./pages/bill";
import { Home } from "./pages/home";
import Login from "./pages/login";
import { Profile } from "./pages/profile";
import Register from "./pages/register";

function App() {

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/bills"
          element={isLoggedIn ? <Bills /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={isLoggedIn ? <Profile /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App
