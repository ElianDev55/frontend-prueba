import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Bills } from "./pages/bill";
import { Home } from "./pages/home";
import Login from "./pages/login";
import { Profile } from "./pages/profile";
import Register from "./pages/register";

function App() {
  const [validateData, setValidateData] = useState<{ response: any; cargar: boolean }>({
    response: {},
    cargar: true,
  });

  // Ejecutar cada 1 segundo
  useEffect(() => {
    let intervalId: any;

    const runValidation = async () => {
      // Llama a useValidateToken manualmente
      // useValidateToken es un custom hook, así que extraemos la lógica aquí
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/validate-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: localStorage.getItem('token'),
          }),
        });

        if (!response.ok) {
          setValidateData({ response: { status: response.status }, cargar: false });
          return;
        }

        const data = await response.json();
        setValidateData({ response: data, cargar: false });
      } catch (err: any) {
        setValidateData({ response: {}, cargar: false });
      }
    };

    // Ejecutar inmediatamente y luego cada 1 segundo
    runValidation();
    intervalId = setInterval(runValidation, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const { response, cargar } = validateData;

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
