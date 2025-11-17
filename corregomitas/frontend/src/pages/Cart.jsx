import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Cart = () => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  const { cart, updateCartItem, removeFromCart, clearCart, getCartTotal, user, API_URL } = useAuth()
  const navigate = useNavigate()

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const token = localStorage.getItem('token')
      
      const orderData = {
        productos: cart.map(item => ({
          id: item.id,
          cantidad: item.quantity,
          precio: item.precio
        })),
        total: getCartTotal()
      }

      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message)
      }

      setMessage('¡Pedido realizado exitosamente!')
      clearCart()
      
      setTimeout(() => {
        navigate('/my-orders')
      }, 2000)

    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <i className="fas fa-shopping-cart" style={{ fontSize: '4rem', color: '#bdc3c7', marginBottom: '1rem' }}></i>
          <h2 style={{ color: '#7f8c8d', marginBottom: '1rem' }}>Tu carrito está vacío</h2>
          <p style={{ color: '#95a5a6', marginBottom: '2rem' }}>Agrega algunas gomitas deliciosas a tu carrito</p>
          <button 
            onClick={() => navigate('/products')}
            className="btn btn-primary"
          >
            <i className="fas fa-store" style={{ marginRight: '0.5rem' }}></i>
            Ir a Comprar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div style={{ margin: '2rem 0' }}>
        <h1 style={{ marginBottom: '2rem', color: '#2c3e50' }}>Tu Carrito de Compras</h1>

        {message && (
          <div className={`alert ${message.includes('éxito') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        <div className="card">
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                <img 
                  src={item.imagen || '/placeholder-gomitas.jpg'} 
                  alt={item.nombre}
                  style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/60x60/ff6b6b/ffffff?text=G'
                  }}
                />
                <div>
                  <h4 style={{ marginBottom: '0.25rem' }}>{item.nombre}</h4>
                  <p style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>${item.precio} c/u</p>
                </div>
              </div>

              <div className="quantity-controls">
                <button
                  onClick={() => updateCartItem(item.id, item.quantity - 1)}
                  className="quantity-btn"
                >
                  -
                </button>
                <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: 'bold' }}>
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateCartItem(item.id, item.quantity + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>

              <div style={{ minWidth: '80px', textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold', color: '#e74c3c' }}>
                  ${(item.precio * item.quantity).toFixed(2)}
                </div>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="btn btn-danger"
                style={{ marginLeft: '1rem' }}
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ))}

          <div className="cart-total">
            Total: ${getCartTotal().toFixed(2)}
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button
              onClick={clearCart}
              className="btn btn-secondary"
            >
              <i className="fas fa-trash" style={{ marginRight: '0.5rem' }}></i>
              Vaciar Carrito
            </button>
            
            <button
              onClick={handleCheckout}
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>
                  Procesando...
                </>
              ) : (
                <>
                  <i className="fas fa-credit-card" style={{ marginRight: '0.5rem' }}></i>
                  Finalizar Compra
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart