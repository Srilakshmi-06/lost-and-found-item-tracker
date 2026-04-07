const stopwords = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'if', 'in', 'into', 'is', 'it', 'no', 'not', 'of', 'on', 'or', 'such', 'that', 'the', 'their', 'then', 'there', 'these', 'they', 'this', 'to', 'was', 'will', 'with', 'my', 'own', 'found', 'lost', 'your'
]);

/**
 * Generate an array of tags from text elements.
 * @param {string|string[]} textItems one or multiple strings
 * @returns {string[]} array of unique lowercase tags
 */
const generateTags = (...textItems) => {
    const textBlob = textItems.join(' ').toLowerCase();
    // Use regex to keep only alphanumeric then split by space
    const allWords = textBlob.replace(/[^a-z0-9 ]/g, '').split(/\s+/);
    const filteredTags = allWords.filter(word => word.length > 2 && !stopwords.has(word));
    return [...new Set(filteredTags)];
};

module.exports = { generateTags };
