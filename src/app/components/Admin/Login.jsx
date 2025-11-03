'use client';
import { useState } from 'react';
import EvalPassword from './EvalPswd';

export default function Login({ setIsLoggedIn, password = null }) {
  const [pswd, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (ev) => {
    setPassword(ev.target.value);
    setError('');
  }

  const handleSubmit = (ev) => {
    ev.preventDefault();
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const isValid = EvalPassword(pswd);

      if (isValid) {
        setIsLoggedIn(true);
      } else {
        setError('Contraseña incorrecta. Por favor, intenta de nuevo.');
      }
      setIsLoading(false);
    }, 500);
  }

  return (
    <div className='section admin-panel'>
      <div className="section-title">
        <h1 className="gradient-text">Panel de Administración</h1>
        <p style={{ color: 'var(--muted)', textAlign: 'center' }}>Acceso restringido</p>
      </div>

      <form className="card glass login" onSubmit={handleSubmit}>
        {error && (
          <div className="admin-status error">
            {error}
          </div>
        )}

        <input
          className="form-input"
          type="password"
          placeholder="Ingresa la contraseña de administración"
          value={pswd}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="admin-loading"></span>
              Verificando...
            </>
          ) : (
            'Acceder'
          )}
        </button>
      </form>
    </div>
  )
}