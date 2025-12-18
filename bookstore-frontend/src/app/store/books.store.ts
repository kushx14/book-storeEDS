import {
  signalStore,
  withState,
  withMethods,
  withComputed,
  patchState
} from '@ngrx/signals';
import { inject, computed } from '@angular/core';
import { BooksService } from '../core/services/books.service';

interface Book {
  _id: string;
  title: string;
  author: string;
  overview: string;
  image: string;
  copiesAvailable: number;
  owner: string;
  boughtBy: string[];
  rentedBy: { user: string; rentUntil: Date }[];
}

export const BooksStore = signalStore(
  { providedIn: 'root' },

  withState({
    books: [] as Book[],
    loading: false,
    selectedBook: null as Book | null
  }),

  withComputed((store) => ({
    allBooks: computed(() => store.books())
  })),

  withMethods((store, api = inject(BooksService)) => ({
    async loadBooks() {
      patchState(store, { loading: true });
      const books = await api.getAllBooks();
      patchState(store, { books, loading: false });
    },

    async addBook(book: any, file?: File | null) {
      const newBook = await api.addBook(book, file);
      patchState(store, { books: [...store.books(), newBook] });
    },

    async loadBookById(id: string) {
      // First try from store
      const existing = store.books().find(b => b._id === id);
      if (existing) {
        patchState(store, { selectedBook: existing });
        return;
      }

      // Else fetch from backend
      patchState(store, { loading: true });
      const book = await api.getBookById(id);
      patchState(store, { books: [...store.books(), book], selectedBook: book, loading: false });
    },

    async buyBook(id: string) {
      const updated = await api.buyBook(id);
      const newBooks = store.books().map(b => b._id === id ? updated : b);
      patchState(store, { books: newBooks, selectedBook: updated });
    },

    async rentBook(id: string, days: number) {
      const updated = await api.rentBook(id, days);
      const newBooks = store.books().map(b => b._id === id ? updated : b);
      patchState(store, { books: newBooks, selectedBook: updated });
    }
  }))
);