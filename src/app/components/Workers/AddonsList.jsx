"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Loader from "../loader/Loader";

export default function AddonsList() {
  const [addons, setAddons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAddons = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/addons");

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setAddons(data.data || []);
      
    } catch (err) {
      console.error("Error fetching addons:", err);
      setError(err.message);
      setAddons([]); // Asegurar que addons sea array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddons();
  }, []);

  // Manejar estado de carga
  if (loading) {
    return <Loader message="Cargando Addons" />;
  }

  // Manejar errores
  if (error) {
    return (
      <div className="error-container">
        <p>Error al cargar addons: {error}</p>
        <button 
          className="btn btn-primary" 
          onClick={fetchAddons}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div id="addons" className="grid-3">
      {addons.length === 0 ? (
        <div className="no-results">
          <p>No se encontraron add-ons</p>
          <button 
            className="btn btn-ghost" 
            onClick={fetchAddons}
          >
            Reintentar
          </button>
        </div>
      ) : (
        addons.map((mod) => {
          const latestFile = mod.latestFiles?.[0];
          const downloadUrl = latestFile?.downloadUrl || "#";
          const logoUrl = mod.logo?.url || "/default-addon.png"; // Imagen por defecto
          const downloadCount = mod.downloadCount || 0;
          const websiteUrl = mod.links?.websiteUrl || "#";

          return (
            <Link
              key={mod.id}
              href={`/addons/${mod.id}`}
              className="card glass addon"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="thumb">
                <img 
                  src={logoUrl} 
                  alt={mod.name}
                  onError={(e) => {
                    e.target.src = "/default-addon.png";
                  }}
                />
              </div>
              <h3>{mod.name}</h3>
              <p className="summary">
                {mod.summary || "Sin descripción disponible"}
              </p>
              <small className="downloads">
                {downloadCount.toLocaleString()} descargas
              </small>
              <div className="actions">
                <button
                  className="btn btn-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (downloadUrl !== "#") {
                      window.open(downloadUrl, "_blank", "noopener,noreferrer");
                    }
                  }}
                  disabled={downloadUrl === "#"}
                >
                  Descargar
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (websiteUrl !== "#") {
                      window.open(websiteUrl, "_blank", "noopener,noreferrer");
                    }
                  }}
                  disabled={websiteUrl === "#"}
                >
                  Detalles
                </button>
              </div>
            </Link>
          );
        })
      )}
    </div>
  );
}