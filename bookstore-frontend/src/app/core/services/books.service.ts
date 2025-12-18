import { Injectable, inject } from '@angular/core';
import { UserInfoStore } from '../../store/user-info.store';

@Injectable({ providedIn: 'root' })
export class BooksService {
  private API = 'http://localhost:3001/api/books';
  private userStore = inject(UserInfoStore);

  async getAllBooks() {
    const res = await fetch(this.API);
    return res.json();
  }

  async getBookById(id: string) {
    const res = await fetch(`${this.API}/${id}`);
    return res.json();
  }

  async buyBook(id: string) {
    const token = this.userStore.token();
    const res = await fetch(`${this.API}/${id}/buy`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  }

  async rentBook(id: string, days: number) {
    const token = this.userStore.token();
    const res = await fetch(`${this.API}/${id}/rent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ days })
    });
    return res.json();
  }

  async getMyBooks() {
    const token = this.userStore.token();
    const res = await fetch(`${this.API}/my/books`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  }

  async addBook(book: any, file?: File | null) {
    const token = this.userStore.token();

    const formData = new FormData();
    formData.append('title', book.title);
    formData.append('author', book.author);
    formData.append('overview', book.overview);
    formData.append('copiesAvailable', book.copiesAvailable.toString());
    if (file) {
      formData.append('image', file);
    }

    const res = await fetch(this.API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    return res.json();
  }
}