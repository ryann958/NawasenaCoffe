/**
 * @typedef {object} MenuItem
 * @property {string} id
 * @property {string} name
 * @property {"Espresso Based" | "Manual Brew" | "Non-Coffee" | "Pastry" | "Main Course"} category
 * @property {string} description
 * @property {number} price
 * @property {string | null} image
 * @property {boolean} available
 */

export const menuCategories = Object.freeze([
  "Espresso Based",
  "Manual Brew",
  "Non-Coffee",
  "Pastry",
  "Main Course",
]);

/** @type {MenuItem[]} */
export const menuItems = [];