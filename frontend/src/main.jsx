import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "@/styles/globals.css"

import { Home } from "@/pages/home"

const root = createRoot(document.getElementById("root"))

root.render(
  <StrictMode>
    <Home />
  </StrictMode>
)
