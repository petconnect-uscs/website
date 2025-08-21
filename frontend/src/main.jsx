import { createRoot } from "react-dom/client"

import { createBrowserRouter, RouterProvider } from "react-router-dom"

import "@/styles/globals.css"

import { Login } from "@/pages/login/Login"
import { Cadastro } from "@/pages/cadastro/Cadastro"
import { Senha } from "@/pages/senha/Senha"
import { Forget } from "./pages/senha/forget/Forget"
import { Email } from "./pages/email/Email"

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
    element: <Senha />
  },
  {
    path: "/esqueceu",
    element: <Forget />
  },
  {
    path: "/email",
    element: <Email />
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
