import { createRoot } from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "@/styles/globals.css";

import { Login } from "@/pages/Login";
import { Cadastro } from "@/pages/Cadastro";
import { Senha } from "@/pages/Senha";
import { Forget } from "@/pages/Forget";
import { Email } from "@/pages/Email";
import { Dashboard as TutorDashboard } from "./pages/tutor/Dashboard";
import { Sidebar } from "./components/sidebar/Sidebar";
import { Pet } from "./pages/tutor/Pet";
import { PetProvider } from "./context/PetProvider";
import { Toaster } from "./components/ui/sonner";

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
		path: "/dashboard",
		element: <Sidebar />,
		children: [
			{
				index: true,
				element: <TutorDashboard />,
			},
			{
				path: "pets",
				element: <Pet />,
			},
		],
	},
]);

const root = createRoot(document.getElementById("root"));

root.render(
	<PetProvider>
		<RouterProvider router={router} />
		<Toaster />
	</PetProvider>,
);
