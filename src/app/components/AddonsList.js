'use client'

import {
  useEffect,
  useState
} from 'react'
import Link from 'next/link'
import Loader from './loader/Loader'

const WORKER_URL = "https://getmods.anthonyuribe3456.workers.dev/";

export default function AddonsList() {
  const [addons,
    setAddons] = useState([]);
  const [loading,
    setLoading] = useState(true);

  useEffect(() => {
    const fetchAddons = async () => {
      try {
        const res = await fetch(WORKER_URL);
        if (!res.ok) throw new Error("Error fetching addons");

        const body = await res.json();
        setAddons(body.data || []);
      } catch (err) {
        console.error("Error loading addons:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAddons();
  },
    []);

  if (loading) {
    return (
      <Loader message="Cargando Addons"></Loader>
    );
  }

  return (
    <div id="addons" className="grid-3">
      {addons.length === 0 ? (
        <p>
          No se encontraron add-ons
        </p>
      ): (
        addons.map((mod) => {
          const downloadUrl = mod.latestFiles?.[0]?.downloadUrl || "#";
          const logoUrl = mod.logo?.url || "";
          const downloadCount = mod.downloadCount || 0;

          return (
            <Link
              key={mod.id}
              href={`/addons/${mod.id}`}
              className="card glass addon"
              style={ { textDecoration: 'none', color: 'inherit' }}
              >
              <div className="thumb">
                <img src={logoUrl} alt={mod.name} />
            </div>
            <h3>{mod.name}</h3>
            <p>
              {mod.summary || ""}
            </p>
            <small>{downloadCount.toLocaleString()} descargas</small>
            <div className="actions">
              <button
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(downloadUrl, '_blank');
                }}
                >
                Descargar
              </button>
              <button
                className="btn btn-ghost"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(mod.links.websiteUrl || "#", '_blank');
                }}
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