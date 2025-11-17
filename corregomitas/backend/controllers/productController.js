const supabase = require('../config/supabase');

// Obtener todos los productos
const getProducts = async (req, res) => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('nombre');

    if (error) throw error;

    res.json(products);
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({ message: 'Error obteniendo productos' });
  }
};

// Obtener producto por ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    res.status(500).json({ message: 'Error obteniendo producto' });
  }
};

// Crear producto (solo admin)
const createProduct = async (req, res) => {
  try {
    const { nombre, precio, descripcion, imagen, stock, categoria } = req.body;

    if (!nombre || !precio || !stock) {
      return res.status(400).json({ message: 'Nombre, precio y stock son requeridos' });
    }

    const { data: product, error } = await supabase
      .from('products')
      .insert([
        {
          nombre,
          precio: parseFloat(precio),
          descripcion,
          imagen,
          stock: parseInt(stock),
          categoria
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Producto creado exitosamente',
      product
    });
  } catch (error) {
    console.error('Error creando producto:', error);
    res.status(500).json({ message: 'Error creando producto' });
  }
};

// Actualizar producto (solo admin)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, descripcion, imagen, stock, categoria } = req.body;

    // Verificar si el producto existe
    const { data: existingProduct, error: checkError } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (checkError || !existingProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const { data: product, error } = await supabase
      .from('products')
      .update({
        nombre,
        precio: precio ? parseFloat(precio) : existingProduct.precio,
        descripcion,
        imagen,
        stock: stock ? parseInt(stock) : existingProduct.stock,
        categoria
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: 'Producto actualizado exitosamente',
      product
    });
  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).json({ message: 'Error actualizando producto' });
  }
};

// Eliminar producto (solo admin)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({ message: 'Error eliminando producto' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};