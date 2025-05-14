import { createRoot } from "react-dom/client"

import { createBrowserRouter, RouterProvider } from "react-router-dom"

import "@/styles/globals.css"

import { Login } from "@/pages/Login/Login"
import { Cadastro } from "@/pages/Cadastro/Cadastro"
import { Senha } from "@/pages/Senha/Senha"
import { Forget } from "./pages/Senha/Forget/Forget"
import { Email } from "./pages/Email/Email"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/cadastro",
    element: <Cadastro />
  },
  {
    path: "/senha",
    element: <Senha/>
  },
  {
    path: "/esqueceu",
    element: <Forget/>
  },
  {
    path: "/email",
    element: <Email/>
  }
])

const root = createRoot(document.getElementById("root"))

root.render(
  <RouterProvider router={router}>
    <Login />
    <Cadastro />
    <Senha/>
    <Forget/>
    <Email/>
  </RouterProvider>
)
