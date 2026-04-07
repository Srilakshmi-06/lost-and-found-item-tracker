const Item = require('../models/Item');
const Match = require('../models/Match');
const { generateTags } = require('../utils/tagging');
const { calculateMatchScore } = require('../utils/matching');

exports.createItem = async (req, res) => {
    try {
        const { title, description, category, location, date, type } = req.body;
        const imageUrl = req.file ? req.file.path : null;

        if (!imageUrl) return res.status(400).json({ message: 'Image upload is required' });

        const tags = generateTags(title, description, category);

        const newItem = new Item({
            userId: req.userId,
            title,
            description,
            category,
            location,
            date,
            imageUrl,
            tags,
            type,
            status: type 
        });

        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getItems = async (req, res) => {
    try {
        const { category, location, date, type, q } = req.query;
        let query = {};

        if (category) query.category = category;
        if (location) query.location = new RegExp(location, 'i');
        if (type) query.type = type;
        if (date) query.date = { $gte: new Date(date) };
        if (q) query.$text = { $search: q };
        // Keep existing behavior (items are visible by default), but allow moderation to hide rejected content.
        query.moderationStatus = { $ne: 'rejected' };

        const items = await Item.find(query).sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getItemDetails = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id).populate('userId', 'name email');
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.findMatches = async (req, res) => {
    try {
        const item = await Item.findById(req.params.itemId);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        // Search for items of opposite type (lost vs found)
        const candidates = await Item.find({
            type: item.type === 'lost' ? 'found' : 'lost',
            category: item.category, // Optimization: match category first
            _id: { $ne: item._id }
        });

        const matches = candidates.map(candidate => ({
            item: candidate,
            score: calculateMatchScore(item, candidate)
        }))
        .filter(match => match.score > 0.3) // Filter those with low scores
        .sort((a, b) => b.score - a.score);

        res.json(matches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const item = await Item.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!item) return res.status(404).json({ message: 'Item not found or unauthorized' });
        res.json({ message: 'Item deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
