const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  expireAt: { type: Date, default: Date.now, expires: 86400 },
});

module.exports = mongoose.model('User', userSchema);
