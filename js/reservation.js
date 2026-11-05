/**
 * Reservation field definitions for a future form. This module does not
 * render a form, submit a booking, or contact WhatsApp.
 */
export const reservationFields = Object.freeze([
  Object.freeze({ name: "customerName", type: "text", required: true }),
  Object.freeze({ name: "whatsappNumber", type: "tel", required: true }),
  Object.freeze({ name: "reservationDate", type: "date", required: true }),
  Object.freeze({ name: "reservationTime", type: "time", required: true }),
  Object.freeze({ name: "guestCount", type: "number", required: true }),
  Object.freeze({
    name: "seatingPreference",
    type: "select",
    required: true,
    options: Object.freeze(["indoor", "outdoor", "no-preference"]),
  }),
  Object.freeze({ name: "specialRequests", type: "textarea", required: false }),
]);