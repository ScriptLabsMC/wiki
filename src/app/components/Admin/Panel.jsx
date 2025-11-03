'use client';
import {
  useState,
  useEffect
} from 'react';

export default function AdminPanel() {
  const [formData,
    setFormData] = useState({
      id: '',
      name: '',
      role: '',
      avatar: '',
      bio: '',
      badges: ''
    });

  const [editId,
    setEditId] = useState('');
  const [deleteId,
    setDeleteId] = useState('');
  const [teamMembers,
    setTeamMembers] = useState([]);
  const [isSubmitting,
    setIsSubmitting] = useState(false);
  const [message,
    setMessage] = useState('');
  const [activeTab,
    setActiveTab] = useState('create');

  // Cargar miembros del equipo al montar el componente
  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    try {
      const response = await fetch('/api/team');
      if (response.ok) {
        const data = await response.json();
        setTeamMembers(data);
      }
    } catch (error) {
      console.error('Error loading team members:', error);
    }
  };

  const handleInputChange = (e) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  // CREATE - Agregar nuevo miembro
  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/team/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData, action: 'create'
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('✅ Miembro del equipo agregado exitosamente!');
        setFormData({
          id: '',
          name: '',
          role: '',
          avatar: '',
          bio: '',
          badges: ''
        });
        loadTeamMembers(); // Recargar la lista
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setMessage('❌ Error al conectar con el servidor');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(''), 5000);
    }
  }

  // EDIT - Cargar datos del miembro a editar
  const handleLoadMember = async (e) => {
    e.preventDefault();
    if (!editId) {
      setMessage('❌ Por favor ingresa un ID');
      return;
    }

    try {
      const member = teamMembers.find(m => m.id === editId);
      if (member) {
        setFormData({
          id: member.id,
          name: member.name,
          role: member.role,
          avatar: member.avatar,
          bio: member.bio,
          badges: member.badges.join(', ')
        });
        setMessage('✅ Miembro cargado para edición');
      } else {
        setMessage('❌ No se encontró ningún miembro con ese ID');
      }
    } catch (error) {
      setMessage('❌ Error al cargar el miembro');
    }
  }

  // EDIT - Actualizar miembro
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.id) {
      setMessage('❌ Primero carga un miembro para editar');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/team/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData, action: 'update'
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('✅ Miembro actualizado exitosamente!');
        setFormData({
          id: '',
          name: '',
          role: '',
          avatar: '',
          bio: '',
          badges: ''
        });
        setEditId('');
        loadTeamMembers();
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setMessage('❌ Error al conectar con el servidor');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(''), 5000);
    }
  }

  // DELETE - Eliminar miembro
  const handleDelete = async (e) => {
    e.preventDefault();
    if (!deleteId) {
      setMessage('❌ Por favor ingresa un ID');
      return;
    }

    if (!confirm(`¿Estás seguro de que quieres eliminar al miembro con ID: ${deleteId}?`)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/team/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: deleteId, action: 'delete'
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('✅ Miembro eliminado exitosamente!');
        setDeleteId('');
        loadTeamMembers();
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setMessage('❌ Error al conectar con el servidor');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(''), 5000);
    }
  }

  return (
    <div className="section admin-panel">
      <h1 className="section-title gradient-text">Manage Team Members</h1>

      {message && (
        <div className={`admin-status ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Agregar
        </button>
        <button
          className={`tab-btn ${activeTab === 'edit' ? 'active' : ''}`}
          onClick={() => setActiveTab('edit')}
        >
          Editar
        </button>
        <button
          className={`tab-btn ${activeTab === 'delete' ? 'active' : ''}`}
          onClick={() => setActiveTab('delete')}
        >
          Eliminar
        </button>
      </div>

      {/* CREATE Fieldset */}
      {activeTab === 'create' && (
        <form className="card glass" onSubmit={handleCreate}>
          <fieldset>
            <legend>Agregar Nuevo Miembro</legend>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="id">ID *</label>
                <input
                  className="form-input"
                  id="id"
                  name="id"
                  placeholder="id-unico (ej: ajr-uribe)"
                  value={formData.id}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="name">Nombre *</label>
                <input
                  className="form-input"
                  id="name"
                  name="name"
                  placeholder="Nombre completo o display"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="role">Role *</label>
                <input
                  className="form-input"
                  id="role"
                  name="role"
                  placeholder="Leader • Script API"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="avatar">Avatar URL</label>
                <input
                  className="form-input"
                  id="avatar"
                  name="avatar"
                  placeholder="/media/avatar_nombre.png"
                  value={formData.avatar}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="bio">Biografía *</label>
              <textarea
                className="form-input"
                id="bio"
                name="bio"
                placeholder="Descripción del miembro"
                rows="3"
                value={formData.bio}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="badges">Badges</label>
              <input
                className="form-input"
                id="badges"
                name="badges"
                placeholder="Dev,Founder (separar por comas)"
                value={formData.badges}
                onChange={handleInputChange}
              />
              <small style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
                Separar badges por comas (ej: Dev,Founder,Helper)
              </small>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="admin-loading"></span>
                  Agregando...
                </>
              ) : (
                'Agregar Miembro'
              )}
            </button>
          </fieldset>
        </form>
      )}

      {/* EDIT Fieldset */}
      {activeTab === 'edit' && (
        <div className="card glass">
          <fieldset>
            <legend>Editar Miembro Existente</legend>

            <div className="form-group">
              <label className="form-label" htmlFor="editId">ID del Miembro a Editar *</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  className="form-input"
                  id="editId"
                  placeholder="Ingresa el ID del miembro"
                  value={editId}
                  onChange={(e) => setEditId(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleLoadMember}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Cargar
                </button>
              </div>
            </div>

            <form onSubmit={handleUpdate}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-id">ID *</label>
                  <input
                    className="form-input"
                    id="edit-id"
                    name="id"
                    placeholder="id-unico"
                    value={formData.id}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="edit-name">Nombre *</label>
                  <input
                    className="form-input"
                    id="edit-name"
                    name="name"
                    placeholder="Nombre completo o display"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="edit-role">Role *</label>
                  <input
                    className="form-input"
                    id="edit-role"
                    name="role"
                    placeholder="Leader • Script API"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="edit-avatar">Avatar URL</label>
                  <input
                    className="form-input"
                    id="edit-avatar"
                    name="avatar"
                    placeholder="/media/avatar_nombre.png"
                    value={formData.avatar}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-bio">Biografía *</label>
                <textarea
                  className="form-input"
                  id="edit-bio"
                  name="bio"
                  placeholder="Descripción del miembro"
                  rows="3"
                  value={formData.bio}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-badges">Badges</label>
                <input
                  className="form-input"
                  id="edit-badges"
                  name="badges"
                  placeholder="Dev,Founder (separar por comas)"
                  value={formData.badges}
                  onChange={handleInputChange}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting || !formData.id}
              >
                {isSubmitting ? (
                  <>
                    <span className="admin-loading"></span>
                    Actualizando...
                  </>
                ) : (
                  'Actualizar Miembro'
                )}
              </button>
            </form>
          </fieldset>
        </div>
      )}

      {/* DELETE Fieldset */}
      {activeTab === 'delete' && (
        <form className="card glass" onSubmit={handleDelete}>
          <fieldset>
            <legend>Eliminar Miembro</legend>

            <div className="form-group">
              <label className="form-label" htmlFor="deleteId">ID del Miembro a Eliminar *</label>
              <input
                className="form-input"
                id="deleteId"
                placeholder="Ingresa el ID del miembro a eliminar"
                value={deleteId}
                onChange={(e) => setDeleteId(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Miembros Existentes</label>
              <div className="members-list" style={{ maxHeight: '200px', overflowY: 'auto', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                {teamMembers.length === 0 ? (
                  <p style={{ color: 'var(--muted)', textAlign: 'center' }}>
                    No hay miembros registrados
                  </p>
                ) : (
                  teamMembers.map(member => (
                    <div key={member.id} style={{ padding: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                      <strong style={{ color: 'var(--primary)' }}>{member.id}</strong> - {member.name}
                    </div>
                  ))
                )}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-danger"
              disabled={isSubmitting || !deleteId}
              style={{ background: '#ff4444', color: 'white' }}
            >
              {isSubmitting ? (
                <>
                  <span className="admin-loading"></span>
                  Eliminando...
                </>
              ) : (
                'Eliminar Miembro'
              )}
            </button>
          </fieldset>
        </form>
      )}
    </div>
  )
}