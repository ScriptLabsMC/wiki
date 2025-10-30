// app/layout.jsx
import "./globals.css";
import { Inter } from "next/font/google";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import HeroBackground from "./components/Layout/HeroBackground";
import ClientWrapper from "./components/Utils/ClientWrapper";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head />
      <body className={inter.className}>
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
