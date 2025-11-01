"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const WORKER = "https://team.anthonyuribe3456.workers.dev";

function imgOrDefault(url) {
	if (!url || url === "null" || url === "undefined")
		return "/assets/img/svg/person.svg";
	return url;
}

export default function TeamList() {
	const [team, setTeam] = useState([]);
	const [selectedMember, setSelectedMember] = useState(null);

	useEffect(() => {
		const loadTeam = async () => {
			try {
				const res = await fetch(`${WORKER}/team`);
				if (!res.ok) throw new Error("Error fetching team");

				const teamData = await res.json();
				setTeam(teamData || []);
			} catch (e) {
				console.error("Error loading team:", e);
			}
		};

		loadTeam();
	}, []);

	const showOverview = (member) => {
		setSelectedMember(member);
	};

	return (
		<>
			<div className="grid-3 team">
				{team.map((member) => (
					<div
						key={member.id}
						className="card glass person"
						onClick={() => showOverview(member)}
						style={{ cursor: "pointer" }}>
						<div className="avatar">
							<img
								src={imgOrDefault(member.avatar)}
								alt={member.name}
							/>
						</div>
						<h3 style={{ fontFamily: "cursive", fontSize: "20pt" }}>
							{member.name}
						</h3>
						<p>{member.role || ""}</p>
					</div>
				))}

				{/* CTA card */}
				<div
					className="card glass"
					style={{ textAlign: "center" }}>
					<h3>¿Quieres formar parte de nuestro equipo?</h3>
					<p>
						Hey, ¿Quieres unirte a nuestro equipo de desarrollo?
						puedes llenar este
						<Link
							href="/form"
							style={{ color: "var(--primary)" }}>
							<strong> formulario</strong>
						</Link>
						.
					</p>
				</div>
			</div>

			{/* Modal */}
			{selectedMember && (
				<div className="team-modal">
					<div className="modal-content glass">
						<button
							className="close-btn"
							onClick={() => setSelectedMember(null)}>
							&times;
						</button>
						<div className="avatar">
							<img
								src={imgOrDefault(selectedMember.avatar)}
								alt={selectedMember.name}
							/>
						</div>
						<h2>{selectedMember.name}</h2>
						<p>
							<em>{selectedMember.role || ""}</em>
						</p>
						<p>{selectedMember.bio || ""}</p>
					</div>
				</div>
			)}
		</>
	);
}
