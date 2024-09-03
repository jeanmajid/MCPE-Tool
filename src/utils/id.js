/**
 * @returns {string} - A unique id
 */
function generateUniqueId() {
  return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
}

module.exports = {
  generateUniqueId
};