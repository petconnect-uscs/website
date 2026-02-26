import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pet Connect",
  description: "O melhor jeito de administrar sua clínica.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={cn(
          "antialiased font-sans",
          sans.variable,
          geistMono.variable,
        )}
      >
        {children}
      </body>
    </html>
  );
}
