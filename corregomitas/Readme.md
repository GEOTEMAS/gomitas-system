# Sistema de Inventario y Pedidos para Negocio de Gomitas

Sistema web completo para gestión de inventario y pedidos de un negocio de gomitas.

## Características

### Para Clientes
- Catálogo de productos con fotos y precios
- Carrito de compras
- Sistema de pedidos
- Seguimiento de pedidos
- Registro y autenticación

### Para Administradores
- CRUD completo de productos
- Gestión de inventario
- Control de pedidos
- Cambio de estatus de pedidos
- Dashboard administrativo

## Tecnologías

### Frontend
- React 18
- Vite
- React Router DOM
- CSS3

### Backend
- Node.js
- Express.js
- JWT para autenticación
- Bcrypt para hash de contraseñas

### Base de Datos
- Supabase (PostgreSQL)

## Instalación Local

### Prerrequisitos
- Node.js 16+
- Cuenta en Supabase

### Pasos
1. Clonar el repositorio
2. Configurar backend:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Editar .env con tus credenciales
   npm run dev