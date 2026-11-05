/**
 * @typedef {object} EventItem
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string | null} image
 * @property {string} startDate Date in YYYY-MM-DD format.
 * @property {string} endDate Date in YYYY-MM-DD format.
 * @property {string} startTime Time in HH:mm format.
 * @property {string} endTime Time in HH:mm format.
 * @property {string} ctaLabel
 * @property {string | null} ctaUrl
 * @property {"draft" | "upcoming" | "ongoing" | "ended"} status
 */

/** @type {EventItem[]} */
export const events = [];