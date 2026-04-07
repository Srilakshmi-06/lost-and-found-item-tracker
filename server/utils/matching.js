/**
 * Calculation:
 * matchScore = (tagMatches * 0.5) + (locationMatch * 0.3) + (dateCloseness * 0.2)
 *
 * @param {Object} lostItem Mongoose document
 * @param {Object} foundItem Mongoose document
 * @returns {number} score between 0 and 1 (approx)
 */
const calculateMatchScore = (lostItem, foundItem) => {
    // 1. Tag Matches (Count common tags)
    const setLost = new Set(lostItem.tags);
    const commonTags = foundItem.tags.filter(tag => setLost.has(tag));
    // Normalize tag matches (max tag match is usually cap'ed or weighted by count)
    const tagMatchScore = commonTags.length > 0 ? (commonTags.length / Math.max(lostItem.tags.length, foundItem.tags.length, 1)) : 0;

    // 2. Location Match (Simple equality check for now)
    const locationMatch = (lostItem.location.toLowerCase().trim() === foundItem.location.toLowerCase().trim()) ? 1 : 0;

    // 3. Date Closeness (1 / (1 + daysDifference))
    const diffTime = Math.abs(lostItem.date - foundItem.date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const dateCloseness = 1 / (1 + diffDays);

    const finalScore = (tagMatchScore * 0.5) + (locationMatch * 0.3) + (dateCloseness * 0.2);
    return Math.round(finalScore * 100) / 100; // Round to 2 decimal places
};

module.exports = { calculateMatchScore };
