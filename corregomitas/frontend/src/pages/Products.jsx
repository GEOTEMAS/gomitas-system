import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('todos')
  
  const { addToCart, user, API_URL } = useAuth()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`)
      
      if (!response.ok) {
        throw new Error('Error al cargar productos')
      }

      const data = await response.json()
      setProducts(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = filter === 'todos' 
    ? products 
    : products.filter(product => product.categoria === filter)

  const categories = ['todos', ...new Set(products.map(p => p.categoria).filter(Boolean))]

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando productos...</p>
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
        <h1 style={{ marginBottom: '2rem', color: '#2c3e50' }}>Nuestras Gomitas</h1>
        
        <div style={{ marginBottom: '2rem' }}>
          <label className="form-label" style={{ marginRight: '1rem' }}>Filtrar por categoría:</label>
          <select 
            className="form-input" 
            style={{ width: 'auto', display: 'inline-block' }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="alert alert-warning">
            No hay productos disponibles en esta categoría.
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <img 
                  src={product.imagen || '/placeholder-gomitas.jpg'} 
                  alt={product.nombre}
                  className="product-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200/ff6b6b/ffffff?text=Gomitas+Dulces'
                  }}
                />
                <div className="product-info">
                  <h3 className="product-title">{product.nombre}</h3>
                  <p style={{ color: '#7f8c8d', marginBottom: '1rem', fontSize: '0.9rem' }}>
                    {product.descripcion}
                  </p>
                  <div className="product-price">${product.precio}</div>
                  <div className="product-stock">
                    {product.stock > 0 
                      ? `${product.stock} disponibles` 
                      : 'Agotado'
                    }
                  </div>
                  
                  {user && product.stock > 0 && (
                    <button
                      onClick={() => addToCart(product, 1)}
                      className="btn btn-primary"
                      style={{ width: '100%', marginTop: '1rem' }}
                    >
                      <i className="fas fa-cart-plus" style={{ marginRight: '0.5rem' }}></i>
                      Agregar al Carrito
                    </button>
                  )}

                  {!user && (
                    <div className="alert alert-warning" style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                      Inicia sesión para comprar
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Products