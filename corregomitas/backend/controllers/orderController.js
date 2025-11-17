const supabase = require('../config/supabase');

// Crear pedido
const createOrder = async (req, res) => {
  try {
    const { productos, total } = req.body;
    const userId = req.user.id;

    if (!productos || !total || productos.length === 0) {
      return res.status(400).json({ message: 'Productos y total son requeridos' });
    }

    // Verificar stock disponible
    for (const item of productos) {
      const { data: product, error } = await supabase
        .from('products')
        .select('stock, nombre')
        .eq('id', item.id)
        .single();

      if (error || !product) {
        return res.status(404).json({ message: `Producto ${item.id} no encontrado` });
      }

      if (product.stock < item.cantidad) {
        return res.status(400).json({ 
          message: `Stock insuficiente para ${product.nombre}. Disponible: ${product.stock}` 
        });
      }
    }

    // Crear pedido
    const { data: order, error } = await supabase
      .from('orders')
      .insert([
        {
          user_id: userId,
          productos,
          total: parseFloat(total),
          estatus: 'pendiente'
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // Actualizar stock de productos
    for (const item of productos) {
      await supabase
        .from('products')
        .update({ stock: supabase.sql`stock - ${item.cantidad}` })
        .eq('id', item.id);
    }

    res.status(201).json({
      message: 'Pedido creado exitosamente',
      order
    });
  } catch (error) {
    console.error('Error creando pedido:', error);
    res.status(500).json({ message: 'Error creando pedido' });
  }
};

// Obtener pedidos del usuario
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('fecha', { ascending: false });

    if (error) throw error;

    res.json(orders);
  } catch (error) {
    console.error('Error obteniendo pedidos:', error);
    res.status(500).json({ message: 'Error obteniendo pedidos' });
  }
};

// Obtener todos los pedidos (solo admin)
const getAllOrders = async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        users:user_id (nombre, email)
      `)
      .order('fecha', { ascending: false });

    if (error) throw error;

    res.json(orders);
  } catch (error) {
    console.error('Error obteniendo pedidos:', error);
    res.status(500).json({ message: 'Error obteniendo pedidos' });
  }
};

// Actualizar estatus de pedido (solo admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { estatus } = req.body;

    const validStatuses = ['pendiente', 'preparado', 'entregado'];
    if (!validStatuses.includes(estatus)) {
      return res.status(400).json({ message: 'Estatus inválido' });
    }

    const { data: order, error } = await supabase
      .from('orders')
      .update({ estatus })
      .eq('id', id)
      .select()
      .single();

    if (error || !order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    res.json({
      message: 'Estatus actualizado exitosamente',
      order
    });
  } catch (error) {
    console.error('Error actualizando pedido:', error);
    res.status(500).json({ message: 'Error actualizando pedido' });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
};