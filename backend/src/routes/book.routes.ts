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
  if (book.copiesAvailable <= 0)
    return res.status(400).json({ message: 'Not available' });
  if (book.owner!.toString() === (req as any).user.id) return res.status(400).json({ message: 'Cannot buy your own book' });

  book.copiesAvailable -= 1;
  book.boughtBy.push((req as any).user.id);

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
  if (book.copiesAvailable <= 0)
    return res.status(400).json({ message: 'Not available' });
  if (book.owner!.toString() === (req as any).user.id) return res.status(400).json({ message: 'Cannot rent your own book' });

  const rentUntil = new Date();
  rentUntil.setDate(rentUntil.getDate() + days);

  book.copiesAvailable -= 1;
  book.rentedBy.push({
    user: (req as any).user.id,
    rentUntil
  });

  await book.save();
  res.json(book);
});

/**
 * PROTECTED → GET USER BOOKS
 */
router.get('/my/books', authMiddleware, async (req, res) => {
  const userId = (req as any).user.id;

  const published = await Book.find({ owner: userId });
  const bought = await Book.find({ boughtBy: { $in: [userId] } });
  const rented = await Book.find({ 'rentedBy.user': userId });

  const now = new Date();
  for (const book of rented) {
    const rentIndex = book.rentedBy.findIndex((r: any) => r.user.toString() === userId);
    if (rentIndex !== -1) {
      const rent = book.rentedBy[rentIndex];
      if (rent.rentUntil && new Date(rent.rentUntil) < now) {
        rent.rentUntil = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
        await book.save();
      }
    }
  }

  res.json({ published, bought, rented });
});

/**
 * PROTECTED → ADD BOOK
 */
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  const { title, author, overview, copiesAvailable } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : '';

  const book = await Book.create({
    title,
    author,
    overview,
    copiesAvailable: Number(copiesAvailable),
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