"use client";
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
			<head>
				<title>
					ScriptLabs — Innovación en Add-ons de Minecraft Bedrock
				</title>
				<meta
					name="description"
					content="Equipo de desarrolladores de Add-ons para Minecraft Bedrock. Herramientas, librerías y tutoriales para ayudarte a crear tus propios add-ons."
				/>
				<meta
					name="theme-color"
					content="#08FFC8"
				/>
				<meta
					name="msapplication-TileColor"
					content="#08FFC8"
				/>
				<meta
					name="google-site-verification"
					content="SlSXf_kb4xBiFHn_nZW2jLEJ9rSz20qwKeYZAHZIAOk"
				/>

				{/* ¡IMPORTANTE! Agrega el favicon aquí */}
				<link
					rel="icon"
					href="/favicon.ico"
				/>

				{/* Structured Data / Schema.org */}
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "Organization",
							name: "ScriptLabs",
							url: "https://scriptlabsmc.vercel.app",
							description:
								"Equipo de desarrolladores de Add-ons para Minecraft Bedrock",
							sameAs: [
								"https://youtube.com/@ScriptLabs",
								"https://discord.gg/BFG3T8MBWN"
							]
						})
					}}
				/>
			</head>
			<body className={inter.className}>
				<HeroBackground />
				<Header />
				<main>{children}</main>
				<Footer />
			</body>
		</html>
	);
}
