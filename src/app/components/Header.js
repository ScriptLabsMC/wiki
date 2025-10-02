"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMobileMenu } from "../hooks/useMobileMenu";

export default function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const pathname = usePathname();
	const { navRef, navToggleRef } = useMobileMenu();

	const navItems = [
		{ href: "/about", label: "About" },
		{ href: "/tools", label: "Tools" },
		{ href: "/addons", label: "Add-ons" },
		{ href: "/tutorials", label: "Tutoriales" },
		{ href: "/templates", label: "Plantillas" },
		{ href: "/community", label: "Comunidad" }
	];

	// Determinar si estamos en home
	const isHome = pathname === "/";

	return (
		<header className="site-header">
			<Link
				className="brand"
				href="/"
				aria-label="ScriptLabs inicio">
				<span className="sl-icon-c">
					<sl className="sl-icon white"></sl>
				</span>
				<span>ScriptLabs</span>
			</Link>

			<nav
				ref={navRef}
				className={`nav ${isMenuOpen ? "open" : ""}`}>
				{/* Botón Inicio si no estamos en home */}
				{!isHome && (
					<Link
						href="/"
						className="nav-home">
						Inicio
					</Link>
				)}

				{navItems.map((item) => (
					<Link
						key={item.href}
						href={item.href}
						className={pathname === item.href ? "active" : ""}
						onClick={() => setIsMenuOpen(false)}>
						{item.label}
					</Link>
				))}
			</nav>

			<button
				ref={navToggleRef}
				className="nav-toggle"
				onClick={() => setIsMenuOpen(!isMenuOpen)}
				aria-label="Abrir menú">
				<sl className="menu white"></sl>
			</button>
		</header>
	);
}
