import mongoose from 'mongoose';


const WordSchema = new mongoose.Schema({
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

export default mongoose.model('Word', WordSchema);