"use client";

import { useEffect, useState } from "react";

const VIDEOS_API = "https://tu-worker.cloudflareworkers.com";

export default function TutorialsList() {
	const [videos, setVideos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState("all");

	useEffect(() => {
		const fetchVideos = async () => {
			try {
				const res = await fetch(VIDEOS_API);
				if (!res.ok) throw new Error("Error fetching videos");

				const data = await res.json();
				setVideos(data || []);
			} catch (err) {
				console.error("Error loading videos:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchVideos();
	}, []);

	const filteredVideos =
		filter === "all"
			? videos
			: videos.filter((video) => video.level === filter);

	if (loading) {
		return <div id="loading">Cargando videos...</div>;
	}

	return (
		<>
			<div className="filters">
				<button
					className={filter === "all" ? "active" : ""}
					onClick={() => setFilter("all")}
					data-filter="all">
					Todos
				</button>
				<button
					className={filter === "beginner" ? "active" : ""}
					onClick={() => setFilter("beginner")}
					data-filter="beginner">
					Principiante
				</button>
				<button
					className={filter === "intermediate" ? "active" : ""}
					onClick={() => setFilter("intermediate")}
					data-filter="intermediate">
					Intermedio
				</button>
				<button
					className={filter === "advanced" ? "active" : ""}
					onClick={() => setFilter("advanced")}
					data-filter="advanced">
					Avanzado
				</button>
			</div>

			<div id="tutorialList">
				{filteredVideos.length === 0 ? (
					<div
						id="not-found"
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center"
						}}>
						No se encontraron videos
					</div>
				) : (
					filteredVideos.map((video, index) => (
						<article
							key={index}
							className="card glass vid"
							data-level={video.level || "no-category"}>
							<h3>{video.title}</h3>
							{video.thumbnail && (
								<img
									src={video.thumbnail}
									alt="miniatura"
								/>
							)}
							<p>Publicado: {video.published}</p>
							<div className="actions">
								<a
									className="btn btn-primary"
									href={video.link}
									target="_blank"
									rel="noopener noreferrer">
									Ver video
								</a>
							</div>
						</article>
					))
				)}
			</div>
		</>
	);
}
