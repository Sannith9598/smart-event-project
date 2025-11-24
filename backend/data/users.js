// data/users.js
// Simple in-memory users store (temporary).
// Structure: [{ id, name, email, passwordHash, role, location }]

// NOTE: This is a temporary developer store for testing without a DB.
// Data will be lost when the server restarts. We'll replace this with a database later.
const users = [];

module.exports = users;
