import { useState } from 'react'
import './App.css'
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
