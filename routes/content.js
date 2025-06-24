const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const contentController = require('../controllers/contentController');

// Public content endpoint (no auth required)
router.get('/public', contentController.getPublicContent);

// Create or update content (requires auth)
router.put('/', auth, contentController.createOrUpdateContent);

// Protected routes (require auth)
router.use(auth);

// Get all content
router.get('/', contentController.getAllContent);

// Post a news item (admin only)
router.post('/news', contentController.postNews);

// Update a news item
router.put('/news/:id', contentController.updateNews);

// Delete a news item
router.delete('/news/:id', contentController.deleteNews);

// Delete content
router.delete('/:id', contentController.deleteContent);

module.exports = router;
