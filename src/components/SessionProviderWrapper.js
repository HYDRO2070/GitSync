"use client"; 
import { SessionProvider } from "next-auth/react";
import Navbar from "./Navbar";
// import { ThemeProvider } from "@/app/context/ThemeContext";

export default function SessionProviderWrapper({ children }) {
  return <SessionProvider>
    <Navbar/>
    {/* <ThemeProvider> */}

    {children}
    {/* </ThemeProvider> */}
    </SessionProvider>;
}
