'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AddonViewer({ addon }) {
  const [activeTab, setActiveTab] = useState('overview')
  
  const latestFile = addon.latestFiles?.[0]
  const downloadUrl = latestFile?.downloadUrl || "#"
  const logoUrl = addon.logo?.url || ""
  const downloadCount = addon.downloadCount || 0
  const websiteUrl = addon.links?.websiteUrl || "#"

  // Formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="section addon-page">
      <div className="addon-header">
        <div className="addon-hero">
          {logoUrl && (
            <img 
              src={logoUrl} 
              alt={addon.name}
              className="addon-logo"
            />
          )}
          <div className="addon-info">
            <h1 className="gradient-text">{addon.name}</h1>
            <p className="addon-summary">{addon.summary || "Add-on para Minecraft Bedrock"}</p>
            
            <div className="addon-stats">
              <div className="stat">
                <span className="stat-number">{downloadCount.toLocaleString()}</span>
                <span className="stat-label">Descargas</span>
              </div>
              {addon.dateReleased && (
                <div className="stat">
                  <span className="stat-number">{formatDate(addon.dateReleased)}</span>
                  <span className="stat-label">Publicado</span>
                </div>
              )}
              {latestFile && (
                <div className="stat">
                  <span className="stat-number">{latestFile.displayName}</span>
                  <span className="stat-label">Versión</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="addon-actions">
          <a 
            href={downloadUrl}
            className="btn btn-primary btn-large"
            rel="noopener noreferrer"
          >
            📥 Descargar Add-on
          </a>
          <a 
            href={websiteUrl}
            className="btn btn-ghost"
            target="_blank"
            rel="noopener noreferrer"
          >
            🌐 Ver en CurseForge
          </a>
          <Link href="/addons" className="btn btn-ghost">
            ↩️ Volver a Add-ons
          </Link>
        </div>
      </div>

      {/* Navegación por pestañas */}
      <nav className="addon-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📋 Resumen
        </button>
        <button 
          className={`tab ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          🔍 Detalles
        </button>
        {addon.latestFiles?.length > 0 && (
          <button 
            className={`tab ${activeTab === 'files' ? 'active' : ''}`}
            onClick={() => setActiveTab('files')}
          >
            📁 Archivos
          </button>
        )}
      </nav>

      {/* Contenido de las pestañas */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-content">
            {addon.description && (
              <section className="description-section">
                <h2>📖 Descripción</h2>
                <div 
                  className="addon-description"
                  dangerouslySetInnerHTML={{ __html: addon.description }}
                />
              </section>
            )}
            
            <section className="quick-info">
              <h2>⚡ Información Rápida</h2>
              <div className="info-grid">
                {addon.authors?.length > 0 && (
                  <div className="info-item">
                    <strong>Autor(es):</strong>
                    <span>{addon.authors.map(author => author.name).join(', ')}</span>
                  </div>
                )}
                {addon.categories?.length > 0 && (
                  <div className="info-item">
                    <strong>Categorías:</strong>
                    <span>{addon.categories.map(cat => cat.name).join(', ')}</span>
                  </div>
                )}
                {addon.dateModified && (
                  <div className="info-item">
                    <strong>Última actualización:</strong>
                    <span>{formatDate(addon.dateModified)}</span>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="details-content">
            <section className="technical-details">
              <h2>🔧 Detalles Técnicos</h2>
              <div className="details-grid">
                {latestFile?.fileLength && (
                  <div className="detail-item">
                    <strong>Tamaño del archivo:</strong>
                    <span>{(latestFile.fileLength / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                )}
                {latestFile?.releaseType && (
                  <div className="detail-item">
                    <strong>Tipo de release:</strong>
                    <span className={`release-type ${latestFile.releaseType}`}>
                      {latestFile.releaseType}
                    </span>
                  </div>
                )}
                {addon.status && (
                  <div className="detail-item">
                    <strong>Estado:</strong>
                    <span className={`status ${addon.status}`}>
                      {addon.status}
                    </span>
                  </div>
                )}
              </div>
            </section>

            {addon.gameVersionLatestFiles?.length > 0 && (
              <section className="compatibility">
                <h2>🎮 Compatibilidad</h2>
                <div className="versions-list">
                  {addon.gameVersionLatestFiles.slice(0, 5).map((version, index) => (
                    <span key={index} className="version-tag">
                      {version.gameVersion}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {activeTab === 'files' && addon.latestFiles?.length > 0 && (
          <div className="files-content">
            <h2>📁 Archivos Disponibles</h2>
            <div className="files-list">
              {addon.latestFiles.slice(0, 10).map((file, index) => (
                <div key={file.id} className="file-card">
                  <div className="file-info">
                    <h4>{file.displayName}</h4>
                    <div className="file-meta">
                      <span>{formatDate(file.fileDate)}</span>
                      <span>{(file.fileLength / 1024 / 1024).toFixed(2)} MB</span>
                      <span className={`release-type ${file.releaseType}`}>
                        {file.releaseType}
                      </span>
                    </div>
                  </div>
                  <a 
                    href={file.downloadUrl}
                    className="btn btn-primary btn-small"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Descargar
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}