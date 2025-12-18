import { Router } from 'express';
import multer from 'multer';
import { Book } from '../models/book.model';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

/**
 * PUBLIC → GET ALL BOOKS
 */
router.get('/', async (_, res) => {
  const books = await Book.find();
  res.json(books);
});

/**
 * PUBLIC → GET SINGLE BOOK
 */
router.get('/:id', async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  res.json(book);
});

/**
 * PROTECTED → BUY BOOK
 */
router.post('/:id/buy', authMiddleware, async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) return res.status(404).json({ message: 'Book not found' });
  if (book.boughtBy) return res.status(400).json({ message: 'Already bought' });
  if (book.owner!.toString() === (req as any).user.id) return res.status(400).json({ message: 'Cannot buy your own book' });

  book.boughtBy = (req as any).user.id;
  book.rentedBy = null;
  book.rentUntil = null;

  await book.save();
  res.json(book);
});

/**
 * PROTECTED → RENT BOOK
 */
router.post('/:id/rent', authMiddleware, async (req, res) => {
  const { days } = req.body;
  const book = await Book.findById(req.params.id);

  if (!book) return res.status(404).json({ message: 'Book not found' });
  if (book.boughtBy || book.rentedBy)
    return res.status(400).json({ message: 'Book unavailable' });
  if (book.owner!.toString() === (req as any).user.id) return res.status(400).json({ message: 'Cannot rent your own book' });

  const rentUntil = new Date();
  rentUntil.setDate(rentUntil.getDate() + days);

  book.rentedBy = (req as any).user.id;
  book.rentUntil = rentUntil;

  await book.save();
  res.json(book);
});

/**
 * PROTECTED → GET USER BOOKS
 */
router.get('/my/books', authMiddleware, async (req, res) => {
  const userId = (req as any).user.id;

  const published = await Book.find({ owner: userId });
  const bought = await Book.find({ boughtBy: userId });
  const rented = await Book.find({ rentedBy: userId });

  res.json({ published, bought, rented });
});

/**
 * PROTECTED → ADD BOOK
 */
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  const { title, author, overview, rating } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : '';

  const book = await Book.create({
    title,
    author,
    overview,
    rating: Number(rating),
    image,
    owner: (req as any).user.id
  });

  res.status(201).json(book);
});

/**
 * PROTECTED → TEST ROUTE
 */
router.get('/protected', authMiddleware, (req, res) => {
  res.json({
    message: 'Protected route accessed',
    user: (req as any).user
  });
});

export default router;