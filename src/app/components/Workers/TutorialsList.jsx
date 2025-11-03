"use client";

import {
  useEffect,
  useState
} from "react";
import Loader from "../loader/Loader";

export default function TutorialsList() {
  const [videos,
    setVideos] = useState([]);
  const [loading,
    setLoading] = useState(true);
  const [error,
    setError] = useState(null);
  const [filter,
    setFilter] = useState("all");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/youtube");

        if (!res.ok) {
          throw new Error(`Error ${res.status}: No se pudieron cargar los videos`);
        }

        const data = await res.json();
        setVideos(data || []);

      } catch (err) {
        console.error("Error loading videos:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  },
    []);

  const filteredVideos = filter === "all"
  ? videos: videos.filter((video) => video.level === filter);

  if (loading) {
    return <Loader message="Cargando Tutoriales de YouTube" />;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>
          Error al cargar los videos: {error}
        </p>
        <button
          className="btn btn-primary"
          onClick={() => window.location.reload()}
          >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="filters">
        <button
          className={filter === "all" ? "active": ""}
          onClick={() => setFilter("all")}
          >
          Todos
        </button>
        <button
          className={filter === "beginner" ? "active": ""}
          onClick={() => setFilter("beginner")}
          >
          Principiante
        </button>
        <button
          className={filter === "intermediate" ? "active": ""}
          onClick={() => setFilter("intermediate")}
          >
          Intermedio
        </button>
        <button
          className={filter === "advanced" ? "active": ""}
          onClick={() => setFilter("advanced")}
          >
          Avanzado
        </button>
      </div>

      <div id="tutorialList">
        {filteredVideos.length === 0 ? (
          <div id="not-found">
            No se encontraron videos
          </div>
        ): (
          filteredVideos.map((video, index) => (
            <article
              key={video.videoId || index}
              className="card glass vid"
              data-level={video.level || "no-category"}
              >
              <h3>{video.title}</h3>
              {video.thumbnail && (
                <img
                src={video.thumbnail}
                alt="miniatura"
                />
            )}
            <p>
              Publicado: {video.published}
            </p>
            <div className="actions">
              <a
                className="btn btn-primary"
                href={video.link}
                target="_blank"
                rel="noopener noreferrer"
                >
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