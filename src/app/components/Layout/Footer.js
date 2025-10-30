"use client";

import Link from "next/link";
import { useCurrentYear } from "../../hooks/useCurrentYear";

export default function Footer() {
	const year = useCurrentYear();

	const navItems = [
		{ href: "/about", label: "About" },
		{ href: "/tools", label: "Tools" },
		{ href: "/addons", label: "Add-ons" },
		{ href: "/tutorials", label: "Tutoriales" },
		{ href: "/community", label: "Comunidad" },
		{ href: "/templates", label: "Templates" },
		{ href: "/docs", label: "Docs" }
	];

	const socialItems = [
		{
			href: "https://youtube.com/@ScriptLabs",
			label: "YouTube",
			class: "yt red",
			spanClass: "yt"
		},
		{
			href: "https://discord.gg/BFG3T8MBWN",
			label: "Discord Server",
			class: "dc purpledc",
			spanClass: "dc"
		},
		{
			href: "https://www.curseforge.com/members/scriptlabs/",
			label: "CurseForge",
			class: "cf orange",
			spanClass: "cf"
		}
	];

	return (
		<footer className="site-footer">
			<div className="footer-content">
				<Link
					className="brand small"
					href="/">
					<sl className="sl-icon"></sl>
					<span>ScriptLabs</span>
				</Link>

				<nav className="footer-nav card glass">
					{navItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}>
							{item.label}
						</Link>
					))}
				</nav>

				<div className="socials card glass">
					{socialItems.map((social) => (
						<a
							key={social.href}
							aria-label={social.label}
							href={social.href}
							target="_blank"
							rel="noopener noreferrer">
							<sl className={social.class}></sl>
							<span className={social.spanClass}>
								{social.label}
							</span>
						</a>
					))}
				</div>

				<p className="legal">
					© {year} ScriptLabs. Todos los derechos reservados.
				</p>
			</div>
		</footer>
	);
}
