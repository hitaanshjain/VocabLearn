import mongoose from 'mongoose';


const WordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    trim: true,
  },
  partOfSpeech:{
    type: String,
      required: true,
  },
  definitions: {
    type: [String],
    required: true,
  },
  correctCount: {
    type: Number,
    default: 0,
  },
  totalTested: {
    type: Number,
    default: 0
  }
});

export default mongoose.model('Word', WordSchema);