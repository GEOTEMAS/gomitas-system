import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const result = await login(email, password)

    if (result.success) {
      navigate('/products')
    } else {
      setMessage(result.message)
    }

    setLoading(false)
  }

  return (
    <div className="container">
      <div style={{ maxWidth: '400px', margin: '4rem auto' }}>
        <div className="card">
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#2c3e50' }}>
            Iniciar Sesión
          </h2>

          {message && (
            <div className="alert alert-error">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Tu contraseña"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: '1rem' }}
              disabled={loading}
            >
              {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <span style={{ color: '#7f8c8d' }}>¿No tienes cuenta? </span>
            <Link to="/register" style={{ color: '#4ecdc4', textDecoration: 'none' }}>
              Regístrate aquí
            </Link>
          </div>

          <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
            <h4 style={{ marginBottom: '0.5rem', color: '#2c3e50' }}>Credenciales de prueba:</h4>
            <p style={{ marginBottom: '0.25rem', fontSize: '0.9rem' }}>
              <strong>Admin:</strong> admin@dulcegomitas.com / 123456
            </p>
            <p style={{ fontSize: '0.9rem' }}>
              <strong>Cliente:</strong> cliente@ejemplo.com / 123456
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login