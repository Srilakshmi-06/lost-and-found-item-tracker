const express = require('express');
const router = express.Router();

const requireAdmin = require('../middleware/requireAdmin');
const adminController = require('../controllers/adminController');

router.use(requireAdmin);

// Users
router.get('/users', adminController.listUsers);
router.patch('/users/:id/role', adminController.setUserRole);

// Items moderation
router.get('/items', adminController.listItems);
router.patch('/items/:id/moderation', adminController.setItemModeration);
router.delete('/items/:id', adminController.deleteItem);

// Reports
router.get('/reports', adminController.reports);

// Settings
router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);

module.exports = router;

