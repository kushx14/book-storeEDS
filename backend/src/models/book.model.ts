import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  overview: String,
  image: String,

  copiesAvailable: {
    type: Number,
    required: true
  },

  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  boughtBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  rentedBy: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rentUntil: Date
  }]
});

export const Book = mongoose.model('Book', bookSchema);