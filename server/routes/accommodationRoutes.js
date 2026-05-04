const express = require('express');
const router = express.Router();
const Accommodation = require('../models/Accommodation');

router.get('/', async (req, res) => {
  try {
    res.json(await Accommodation.find());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const prop = await Accommodation.findOne({ slug: req.params.slug });
    if (!prop) return res.status(404).json({ message: 'Not found' });
    res.json(prop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/seed/defaults', async (req, res) => {
  try {
    await Accommodation.deleteMany();
    const defaults = [
      { slug: 'upstairs-retreat', title: 'South Golden Beach House - Upstairs Retreat', location: 'South Golden Beach, Byron Bay, NSW', price: 180, rating: 4.96, reviewCount: 189, guests: 6, bedrooms: 2, beds: 3, baths: 1 },
      { slug: 'ground-floor-apartment', title: 'South Golden Sea Shack - Ground Floor Apartment', location: 'South Golden Beach, Byron Bay, NSW', price: 165, rating: 4.94, reviewCount: 167, guests: 5, bedrooms: 2, beds: 2, baths: 1 },
    ];
    const created = await Accommodation.insertMany(defaults);
    res.json({ message: 'Seeded', count: created.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;