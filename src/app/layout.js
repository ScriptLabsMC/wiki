// app/layout.jsx
import "./globals.css";
import { Inter } from "next/font/google";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HeroBackground from "./components/HeroBackground";
import ClientWrapper from "./components/ClientWrapper";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head />
      <body className={`${inter.className}`}>
        <ClientWrapper>
          <HeroBackground />
          <Header />
          <main>{children}</main>
          <Footer />
        </ClientWrapper>
      </body>
    </html>
  );
}
