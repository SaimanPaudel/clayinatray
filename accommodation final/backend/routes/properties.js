const express  = require('express');
const router   = express.Router();
const Property = require('../models/Property');

// GET all properties — used by Accommodation listing page
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find(
      { isAvailable: true },
      'title description type price guests beds bedrooms baths image location petFriendly rating reviews'
    );
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single property by id — used by PropertyDetail page
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;