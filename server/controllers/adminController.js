const User = require('../models/User');
const Item = require('../models/Item');
const Match = require('../models/Match');
const SiteSettings = require('../models/SiteSettings');

exports.listUsers = async (req, res) => {
  try {
    const { q } = req.query;
    const query = q
      ? {
          $or: [{ name: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }],
        }
      : {};

    const users = await User.find(query)
      .select('_id name email role createdAt')
      .sort({ createdAt: -1 })
      .limit(200);

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.setUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('_id name email role');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.listItems = async (req, res) => {
  try {
    const { moderationStatus, type, q } = req.query;
    const query = {};

    if (moderationStatus) query.moderationStatus = moderationStatus;
    if (type) query.type = type;
    if (q) query.$text = { $search: q };

    const items = await Item.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(200);

    res.json({ items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.setItemModeration = async (req, res) => {
  try {
    const { moderationStatus } = req.body;
    if (!['approved', 'pending', 'rejected'].includes(moderationStatus)) {
      return res.status(400).json({ message: 'Invalid moderationStatus' });
    }

    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { moderationStatus },
      { new: true }
    ).populate('userId', 'name email');

    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.reports = async (req, res) => {
  try {
    const [users, items, matches] = await Promise.all([
      User.countDocuments(),
      Item.countDocuments(),
      Match.countDocuments(),
    ]);

    const itemsByType = await Item.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);
    const itemsByModeration = await Item.aggregate([
      { $group: { _id: '$moderationStatus', count: { $sum: 1 } } },
    ]);

    res.json({
      totals: { users, items, matches },
      itemsByType,
      itemsByModeration,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.findOne().sort({ createdAt: -1 });
    res.json({
      settings: settings || {
        requireItemApproval: false,
        maintenanceMode: false,
        maintenanceMessage: '',
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { requireItemApproval, maintenanceMode, maintenanceMessage } = req.body;
    const next = {
      ...(typeof requireItemApproval === 'boolean' ? { requireItemApproval } : {}),
      ...(typeof maintenanceMode === 'boolean' ? { maintenanceMode } : {}),
      ...(typeof maintenanceMessage === 'string' ? { maintenanceMessage } : {}),
    };

    const settings = await SiteSettings.findOneAndUpdate({}, next, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    });

    res.json({ settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

