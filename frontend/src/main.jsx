import { createRoot } from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "@/styles/globals.css";

import { Login } from "@/pages/Login";
import { Cadastro } from "@/pages/Cadastro";
import { Senha } from "@/pages/Senha";
import { Forget } from "@/pages/Forget";
import { Email } from "@/pages/Email";
import { Dashboard } from "./pages/tutorPages/dashboard";
import { SideBar } from "./components/sideBar";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/cadastro",
    element: <Cadastro />,
  },
  {
    path: "/senha",
    element: <Senha />,
  },
  {
    path: "/forget",
    element: <Forget />,
  },
  {
    path: "/email",
    element: <Email />,
  },
  {
    element: <SideBar />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      }
    ]
  }
]);

const root = createRoot(document.getElementById("root"));

root.render(<RouterProvider router={router} />);
