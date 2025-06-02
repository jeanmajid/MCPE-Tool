/**
 * @returns {string} - A unique id
 */
export function generateUniqueId() {
    return Math.random().toString(36).substring(2) + new Date().getTime().toString(36);
}
