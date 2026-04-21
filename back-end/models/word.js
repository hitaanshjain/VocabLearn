const mongoose = require('mongoose');


const wordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    trim: true,
  },
  definition: {
    type: String,
    required: true,
    trim: true,},
    
  correctCount: {
    type: Number,
    default: 0,
  },
});
module.exports = mongoose.model('Word', wordSchema);