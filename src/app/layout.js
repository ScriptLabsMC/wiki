"use client"; // ← AÑADIR esto al inicio
import "./globals.css";
import { Inter } from "next/font/google";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HeroBackground from "./components/HeroBackground";
import { useSvgReplacement } from "./hooks/useSvgReplacement";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
	useSvgReplacement();

	return (
		<html lang="es">
			<body className={inter.className}>
				<HeroBackground />
				<Header />
				<main>{children}</main>
				<Footer />
			</body>
		</html>
	);
}
