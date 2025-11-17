import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

const MyOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const { user, API_URL } = useAuth()

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/orders/my-orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Error al cargar pedidos')
      }

      const data = await response.json()
      setOrders(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pendiente: { class: 'status-pendiente', text: 'Pendiente' },
      preparado: { class: 'status-preparado', text: 'Preparado' },
      entregado: { class: 'status-entregado', text: 'Entregado' }
    }
    
    const config = statusConfig[status] || statusConfig.pendiente
    return <span className={`status-badge ${config.class}`}>{config.text}</span>
  }

  if (!user) {
    return (
      <div className="container">
        <div className="alert alert-warning">
          Debes iniciar sesión para ver tus pedidos.
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando tus pedidos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-error">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div style={{ margin: '2rem 0' }}>
        <h1 style={{ marginBottom: '2rem', color: '#2c3e50' }}>Mis Pedidos</h1>

        {orders.length === 0 ? (
          <div className="alert alert-warning">
            No tienes pedidos realizados.
          </div>
        ) : (
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>ID Pedido</th>
                  <th>Fecha</th>
                  <th>Productos</th>
                  <th>Total</th>
                  <th>Estatus</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{new Date(order.fecha).toLocaleDateString()}</td>
                    <td>
                      {order.productos.map((item, index) => (
                        <div key={index} style={{ fontSize: '0.9rem' }}>
                          {item.cantidad} x Producto #{item.id}
                        </div>
                      ))}
                    </td>
                    <td>${order.total}</td>
                    <td>{getStatusBadge(order.estatus)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrders