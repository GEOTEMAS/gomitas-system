import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const { user, API_URL } = useAuth()

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/orders`, {
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

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estatus: newStatus })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message)
      }

      // Actualizar la lista local
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, estatus: newStatus } : order
      ))
      
    } catch (error) {
      setError(error.message)
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

  if (!user || user.role !== 'admin') {
    return (
      <div className="container">
        <div className="alert alert-error">
          No tienes permisos para acceder a esta página.
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando pedidos...</p>
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
        <h1 style={{ marginBottom: '2rem', color: '#2c3e50' }}>Gestión de Pedidos</h1>

        {orders.length === 0 ? (
          <div className="alert alert-warning">
            No hay pedidos realizados.
          </div>
        ) : (
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>ID Pedido</th>
                  <th>Cliente</th>
                  <th>Productos</th>
                  <th>Total</th>
                  <th>Fecha</th>
                  <th>Estatus</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>
                      <div>
                        <strong>{order.users?.nombre}</strong>
                        <div style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>
                          {order.users?.email}
                        </div>
                      </div>
                    </td>
                    <td>
                      {order.productos.map((item, index) => (
                        <div key={index} style={{ fontSize: '0.9rem' }}>
                          {item.cantidad} x Producto #{item.id}
                          <div style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>
                            ${item.precio} c/u
                          </div>
                        </div>
                      ))}
                    </td>
                    <td>${order.total}</td>
                    <td>{new Date(order.fecha).toLocaleDateString()}</td>
                    <td>{getStatusBadge(order.estatus)}</td>
                    <td>
                      <select
                        value={order.estatus}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="form-input"
                        style={{ width: 'auto', minWidth: '120px' }}
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="preparado">Preparado</option>
                        <option value="entregado">Entregado</option>
                      </select>
                    </td>
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

export default AdminOrders