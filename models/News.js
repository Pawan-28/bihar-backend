const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String, // PUBLIC full URL hona chahiye
});

module.exports = mongoose.model('News', newsSchema);