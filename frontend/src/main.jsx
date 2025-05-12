import { createRoot } from "react-dom/client"

import { createBrowserRouter, RouterProvider } from "react-router-dom"

import "@/styles/globals.css"

import { Login } from "@/pages/Login/Login"
import { Cadastro } from "@/pages/cadastro/Cadastro"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/cadastro",
    element: <Cadastro />
  }
])

const root = createRoot(document.getElementById("root"))

root.render(
  <RouterProvider router={router}>
    <Login />
  </RouterProvider>
)
