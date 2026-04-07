const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const authMiddleware = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// Public routes for gallery browsing
router.get('/', itemController.getItems);
router.get('/:id', itemController.getItemDetails);

// Protected routes for posting items
router.post('/', authMiddleware, upload.single('image'), itemController.createItem);
router.delete('/:id', authMiddleware, itemController.deleteItem);

// Matching route
router.get('/match/:itemId', itemController.findMatches);

module.exports = router;
