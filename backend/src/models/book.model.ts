import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  overview: String,
  rating: Number,
  image: String,

  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  boughtBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

  rentedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  rentUntil: { type: Date, default: null }
});

export const Book = mongoose.model('Book', bookSchema);