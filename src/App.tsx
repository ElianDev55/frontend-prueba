import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useValidateToken } from "./hooks/useAutorization";
import { Bills } from "./pages/bill";
import { Home } from "./pages/home";
import Login from "./pages/login";
import { Profile } from "./pages/profile";
import Register from "./pages/register";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const { response, cargar } = !isLoginPage ? useValidateToken() : { response: {}, cargar: false };

  if (cargar) {
    return <div>Loading...</div>;
  }

  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  let isLoggedIn = false;

  if (token && user) {
    isLoggedIn = response.status === 201;
    if (!isLoggedIn) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  console.log(isLoggedIn);


  return (
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
  );
}

export default App
