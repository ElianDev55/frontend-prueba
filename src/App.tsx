import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useValidateToken } from "./hooks/useAutorization";
import { Bills } from "./pages/bill";
import { Home } from "./pages/home";
import Login from "./pages/login";
import { Profile } from "./pages/profile";
import Register from "./pages/register";

function App() {
  const { response, cargar } = useValidateToken();

  // Validar el token cada vez que se navega a una ruta protegida
  if (cargar) {
    return <div>Loading...</div>;
  }

  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  // Función para validar si el token es válido
  const isTokenValid = () => {
    if (!token || !user) return false;
    return response.status === 201;
  };

  // Si el token no es válido, limpiar el localStorage
  if (token && user && response.status !== 201) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  const isLoggedIn = isTokenValid();


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
