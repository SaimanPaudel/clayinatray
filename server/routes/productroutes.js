const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST seed default products
router.post('/seed/defaults', async (req, res) => {
  try {
    await Product.deleteMany();
    const defaults = [
      { title: 'Abstract Coastal Dreams', category: 'PAINTINGS', description: 'Original acrylic painting inspired by South Golden Beach sunsets.', price: 850, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600' },
      { title: 'Ceramic Expression', category: 'CERAMICS', description: 'Hand-crafted ceramic art piece featuring bold line work and organic forms.', price: 420, image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600' },
      { title: 'Abstract Forms', category: 'DRAWINGS', description: 'Bold charcoal drawing on paper exploring organic shapes and fluid lines.', price: 650, image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600' },
      { title: 'Community Art Collaboration', category: 'COLLABORATIVE', description: 'Collaborative outdoor painting created during community art sessions.', price: 1200, image: 'https://images.unsplash.com/photo-1501084817091-a4f3d1d19e07?w=600' },
    ];
    const created = await Product.insertMany(defaults);
    res.json({ message: 'Seeded', count: created.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;