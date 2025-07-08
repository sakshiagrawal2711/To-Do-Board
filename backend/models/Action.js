// backend/models/Action.js

const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  actionType: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

// ✅ Avoid OverwriteModelError
module.exports = mongoose.models.Action || mongoose.model('Action', actionSchema);
